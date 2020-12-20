import Konva from "konva";
import * as React from "react";
import Eventbus from "eventbusjs";
import { StatusBar } from "./StatusBar";
import { KonvaNodeEvents } from "react-konva";
import { GROUP_ITEM_WIDTH } from "../../constants";
import { KonvaEventObject } from "konva/types/Node";
import { TooltipContextProps } from "../TooltipContext";
import { Group as KonvaGroup, IconGroupIcon } from "../../../konva";
import {
  ExtRoadmapGroup,
  OnRoadmapChange,
  ExtRoadmapGroupItem,
  OnChangeItemPositionProps
} from "../../types";

type Props = {
  id: string;
  live: boolean;
  height: number;
  offsetX: number;
  offsetY: number;
  selected: boolean;
  group: ExtRoadmapGroup;
  hoveredItemIds: string[];
  onChange?: OnRoadmapChange;
  groupItems: ExtRoadmapGroupItem[];
  groupVisibleItems: ExtRoadmapGroupItem[];
  onAddGroupItem: (group: ExtRoadmapGroup) => void;
} & TooltipContextProps;

export class Group extends React.PureComponent<Props> {
  render() {
    const { id, height, offsetX, offsetY, group, selected } = this.props;
    const { x, y } = group.position ? group.position : { x: null, y: null };
    return (
      <KonvaGroup
        id={id}
        key={group.id}
        height={height}
        x={x || offsetX}
        y={y || offsetY}
        name={group.name}
        selected={selected}
        onFrame={this.onFrame}
        hovered={this.isHovered}
        draggable={this.isHovered}
        onDragMove={this.onDragMove}
        width={GROUP_ITEM_WIDTH + 32}
        onDragEnd={this.onGrouoDragEnd}
        onDragStart={this.onGrouoDragStart}
        icons={this.resetGroupPositionIcon}
      >
      </KonvaGroup>
    );
  }

  private onDragMove: KonvaNodeEvents["onDragMove"] = e => {
    const group = e.target as unknown as Konva.Group;
    const stage = group.getStage();
    Eventbus.dispatch("onGroupUpdated", stage, group);
  };

  private onFrame = (group: Konva.Group) => {
    const stage = group.getStage();
    Eventbus.dispatch("onGroupUpdated", stage, group);
  };

  private onGrouoDragStart: KonvaNodeEvents["onDragStart"] = e => {
    const group = e.target as unknown as Konva.Group;
    const stage = group.getStage();
    Eventbus.dispatch("onGroupDragStart", stage, group);
  };

  private onGrouoDragEnd: KonvaNodeEvents["onDragEnd"] = e => {
    const group = e.target as unknown as Konva.Group;
    const stage = group.getStage();
    Eventbus.dispatch("onGroupDragEnd", stage, group);
    if (!this.props.onChange) return;
    const { x, y } = e.target.getClientRect({ relativeTo: stage });
    const onChageProps: OnChangeItemPositionProps = {
      id: this.props.id,
      position: { x: x + 1, y }
    };
    this.props.onChange("itemPosition", onChageProps);
  };

  private onAddGroupItem = () => {
    if (!this.props.onAddGroupItem) return;
    this.props.onAddGroupItem(this.props.group);
  };

  private onShowGroupItems = () => {
    if (!this.props.onChange) return;
    const itemIdsToShow: string[] = [];
    for (const groupItem of this.props.groupItems) {
      if (groupItem.isHidden) itemIdsToShow.push(groupItem.id);
    }
    this.props.onChange("groupItemVisibility", itemIdsToShow);
  };

  private get isHovered() {
    const { hoveredItemIds, group } = this.props;
    return hoveredItemIds.length === 1 && hoveredItemIds.indexOf(group.id) !== -1;
  }

  private onUndoClick = () => {
    if (!this.props.onChange) return;
    this.props.hideTooltip();
    const newPositions: OnChangeItemPositionProps[] = [];
    newPositions.push({ id: this.props.id });
    for (const groupItem of this.props.groupItems) {
      newPositions.push({ id: groupItem.id });
    }
    this.props.onChange("itemPosition", newPositions);
  };

  private showTooltip = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const { x, y, width } = e.target.getClientRect({ relativeTo: stage });
    this.props.showTooltip(x + width / 2, y, "resetPosition");
  };

  private get resetGroupPositionIcon() {
    const changedGroupItemPosition = this.props.groupItems.some(item => !!item.position);
    if (!this.props.group.position && !changedGroupItemPosition) {
      return [];
    }
    return [
      {
        icon: "undo",
        onClick: this.onUndoClick,
        onMouseEnter: this.showTooltip,
        onMouseLeave: this.props.hideTooltip
      }
    ] as IconGroupIcon[];
  }
}
