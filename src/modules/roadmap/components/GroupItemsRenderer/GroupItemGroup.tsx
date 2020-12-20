import Konva from "konva";
import * as React from "react";
import { GroupItem } from "./GroupItem";
import { config } from "../../constants";
import { Transition } from "react-spring/renderprops-konva";
import { TooltipContextProps, TooltipContext } from "../TooltipContext";
import {
  ExtRoadmapGroupItem,
  RoadmapGroupItemPosition,
  OnRoadmapChange,
  OnChangeItemPositionProps
} from "../../types";
import { getGroupItemHeight, isNodeInsideAGroup, getAbsouluteOffsetAofB } from "../../helpers";

export type ExtendedRoadmapGroupItem = {
  height: number;
  hovered: boolean;
  selected: boolean;
} & ExtRoadmapGroupItem &
  RoadmapGroupItemPosition;

type State = {
  mounted: boolean;
  sortedItem?: [number, number];
  items: ExtendedRoadmapGroupItem[];
};

type Props = {
  live: boolean;
  selectedId: string;
  hoveredItemIds: string[];
  onChange?: OnRoadmapChange;
  items: ExtRoadmapGroupItem[];
  onEdit: (groupItem: ExtendedRoadmapGroupItem) => void;
  onSortItem: (from: ExtRoadmapGroupItem, to: ExtRoadmapGroupItem) => void;
};

export class GroupItemGroup extends React.PureComponent<Props> {
  state: State = {
    items: [],
    mounted: false,
    sortedItem: null
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  static getDerivedStateFromProps(p: Props) {
    const { padding, spaceBetweenGroupItems } = config;
    const items: ExtendedRoadmapGroupItem[] = p.items.map((item, i) => {
      const selected = p.selectedId === item.id;
      const height = getGroupItemHeight(item, p.live);
      const hoveredItem = p.hoveredItemIds.indexOf(item.id) !== -1;
      const hoveredEditBtn = p.hoveredItemIds.indexOf(item.id + ".edit") !== -1;
      const hoveredHideBtn = p.hoveredItemIds.indexOf(item.id + ".hide") !== -1;
      const hovered = hoveredItem && !hoveredHideBtn && !hoveredEditBtn;
      const { x, y } = item.position ? item.position : { x: null, y: null };
      const newX = x || padding;
      const newY = y || padding + (height + spaceBetweenGroupItems) * i;
      return { ...item, height, hovered, selected, x: newX, y: newY };
    });
    return { items };
  }

  render() {
    return <TooltipContext>{this.renderItems}</TooltipContext>;
  }

  private renderItems = (context: TooltipContextProps) => {
    return (
      <Transition
        trail={80}
        keys={item => item.id}
        items={this.state.items}
        from={{ scaleX: 0, scaleY: 0 }}
        leave={{ scaleX: 0, scaleY: 0 }}
        enter={{ scaleX: 1, scaleY: 1 }}
        initial={this.state.mounted ? undefined : null}
      >
        {(item, state, i) => anim => {
          const sortOffset = this.getSortOffset(i, item.height);
          const offsetY = item.position ? 0 : sortOffset;
          return (
            <GroupItem
              x={item.x}
              item={item}
              id={item.id}
              key={item.id}
              animState={state}
              y={item.y + offsetY}
              height={item.height}
              hovered={item.hovered}
              selected={item.selected}
              animScaleX={anim.scaleX}
              animScaleY={anim.scaleY}
              onEdit={this.props.onEdit}
              onDragEnd={this.onDragEnd}
              onDragMove={this.onDragMove}
              width={config.groupItemWidth}
              onDragStart={this.onDragStart}
              onChange={this.props.onChange}
              showTooltip={context.showTooltip}
              hideTooltip={context.hideTooltip}
              alignItemInGroup={this.alignItemInGroup}
            />
          );
        }}
      </Transition>
    );
  };

  private onDragStart = (e: Konva.KonvaEventObject<DragEvent>, item: ExtendedRoadmapGroupItem) => {
    const stage = e.target.getStage();
    const { x, y } = e.target.getClientRect({ relativeTo: stage });
    const position: OnChangeItemPositionProps = {
      id: item.id,
      position: { x, y }
    };
    this.props.onChange("itemPosition", position);
  };

  private onDragEnd = (e: Konva.KonvaEventObject<DragEvent>, item: ExtendedRoadmapGroupItem) => {
    const itemInstance = e.target as unknown as Konva.Group;
    const stage = e.target.getStage();
    const group: Konva.Group = stage.findOne(`#${item.groupId}`);
    const isInsideAGroup = isNodeInsideAGroup(itemInstance, group);
    if (isInsideAGroup) {
      this.alignItemInGroup(itemInstance, item);
    } else {
      const { x, y } = e.target.getClientRect({ relativeTo: stage });
      const position: OnChangeItemPositionProps = {
        id: item.id,
        position: { x, y }
      };
      this.props.onChange("itemPosition", position);
    }
    if (this.state.sortedItem) {
      const [oldIndex, newIndex] = this.state.sortedItem;
      this.setState({ sortedItem: null });
      this.props.onSortItem(this.props.items[oldIndex], this.props.items[newIndex]);
    }
  };

  private onDragMove = (e: Konva.KonvaEventObject<DragEvent>, item: ExtendedRoadmapGroupItem) => {
    const stage = e.target.getStage();
    const group: Konva.Group = stage.findOne(`#${item.groupId}`);
    const isInsideAGroup = isNodeInsideAGroup(e.target, group);
    if (!isInsideAGroup) return;
    const groupContentRect = group.findOne(".groupContentRect");
    const { y: offsetY } = getAbsouluteOffsetAofB(e.target, groupContentRect);
    const currRow = Math.round(offsetY / (item.height + config.padding / 2));
    const newIndex = Math.min(this.state.items.length - 1, currRow);
    const index = this.state.items.indexOf(item);
    if (index !== newIndex || this.state.sortedItem) {
      this.sortItem(index, newIndex);
    }
  };

  private alignItemInGroup = (itemInstance: Konva.Group, item: ExtendedRoadmapGroupItem) => {
    const stage = itemInstance.getStage();
    const { x, y } = itemInstance.getClientRect({ relativeTo: stage });
    const position: OnChangeItemPositionProps = {
      id: item.id,
      position: { x, y }
    };
    this.props.onChange("itemPosition", position);
    delete position.position;
    this.props.onChange("itemPosition", position);
  };

  private sortItem = (indexA: number, indexB: number) => {
    this.setState({
      sortedItem: indexA === indexB ? null : [indexA, indexB]
    });
  };

  private getSortOffset = (i, height) => {
    let offset = 0;
    const { padding } = config;
    if (!this.state.sortedItem) return offset;
    const [oldIndex, newIndex] = this.state.sortedItem;
    if (oldIndex > newIndex) {
      offset = i >= newIndex && i <= oldIndex ? height + padding / 2 : 0;
    } else {
      offset = i <= newIndex && i >= oldIndex ? -height - padding / 2 : 0;
    }
    return offset;
  };
}
