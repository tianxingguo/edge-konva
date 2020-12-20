import Konva from "konva";
import * as React from "react";
import Eventbus from "eventbusjs";
import { i18n, OnRoadmapChange, ItemDataUser } from "../../types";
import { KonvaNodeEvents } from "react-konva";
import { GROUP_ITEM_WIDTH } from "../../constants";
import { KonvaEventObject } from "konva/types/Node";
import { WH, Position } from "../../../konva/types";
import { State } from "react-spring/renderprops-konva";
import { TooltipContextProps } from "../TooltipContext";
import { ExtendedRoadmapGroupItem } from "./GroupItemGroup";
import { getIconByGroupType, setMaxZindex, sleep } from "../../helpers";
import { ListItem, UserItem, IconGroupIcon, GroupItem as KonvaGroupItem } from "../../../konva";

type Props = {
  id: string;
  animState: State;
  hovered: boolean;
  selected: boolean;
  animScaleX: number;
  animScaleY: number;
  onChange?: OnRoadmapChange;
  item: ExtendedRoadmapGroupItem;
  onEdit: (gItem: ExtendedRoadmapGroupItem) => void;
  alignItemInGroup: (itemInstance: Konva.Group, item: ExtendedRoadmapGroupItem) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>, gItem: ExtendedRoadmapGroupItem) => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>, gItem: ExtendedRoadmapGroupItem) => void;
  onDragStart: (e: Konva.KonvaEventObject<DragEvent>, gItem: ExtendedRoadmapGroupItem) => void;
} & WH &
  Position &
  TooltipContextProps;

export class GroupItem extends React.PureComponent<Props> {
  state = {
    x: 0,
    y: 0,
    mounted: false,
    dragging: false
  };

  constructor(props: Props) {
    super(props);
    this.rightIcons = [
      {
        onClick: this.onEdit,
        id: `${props.id}.edit`,
        icon: "pencil-square-o",
        onMouseLeave: this.props.hideTooltip,
        onMouseEnter: e => this.showTooltip(e, "edit")
      },
     /* {
        icon: "eye-slash",
        onClick: this.onHide,
        id: `${props.id}.hide`,
        onMouseLeave: this.props.hideTooltip,
        onMouseEnter: e => this.showTooltip(e, "hide")
      } */
    ];
    this.leftIcons = [{ icon: getIconByGroupType(props.item.groupType) }];
  }

  private item: Konva.Group;
  private stage: Konva.Stage;
  private groupContent: Konva.Group;
  private leftIcons: IconGroupIcon[];
  private rightIcons: IconGroupIcon[];

  async componentDidMount() {
    this.stage = this.item.getStage();
    this.groupContent = this.stage.findOne(`#${this.props.item.groupId}`);
    Eventbus.addEventListener("onGroupUpdated", this.onGroupUpdated, this.stage);
    Eventbus.addEventListener("onGroupDragStart", this.onGroupDragStart, this.stage);
    this.updateGroupOffset();
    await sleep(0);
    this.setState({ mounted: true });
  }

  componentDidUpdate() {
    Eventbus.dispatch("onGroupItemUpdated", this.stage, this.item);
  }

  componentWillUnmount() {
    Eventbus.removeEventListener("onGroupUpdated", this.onGroupUpdated, this.stage);
    Eventbus.removeEventListener("onGroupDragStart", this.onGroupDragStart, this.stage);
  }

  render() {
    const { x, y, mounted, dragging } = this.state;
    const { id, hovered, item, animScaleX, animScaleY, selected } = this.props;
    return (
      <KonvaGroupItem
        id={id}
        x={this.props.x + (item.position ? 0 : x)}
        y={this.props.y + (item.position ? 0 : y)}
        hovered={hovered}
        selected={selected}
        draggable={hovered}
        onFrame={this.onFrame}
        animScaleX={animScaleX}
        animScaleY={animScaleY}
        width={this.props.width}
        innerRef={this.setItemRef}
        height={this.props.height}
        onDragEnd={this.onDragEnd}
        onDragMove={this.onDragMove}
        onMouseDown={this.onMouseDown}
        onDragStart={this.onDragStart}
        onMouseLeave={this.onMouseLeave}
        onMouseEnter={this.onMouseEnter}
        disabledAnimation={!mounted || dragging || !!item.position}
      >
        {this.content}
      </KonvaGroupItem>
    );
  }

  private onHide = () => {
    if (this.props.onChange) {
      this.props.hideTooltip();
      this.props.onChange("groupItemVisibility", this.props.item.id);
    }
  };

  private onEdit = () => {
    if (this.props.onEdit) {
      this.props.onEdit(this.props.item);
    }
  };

  private onFrame = (instance: Konva.Group) => {
    Eventbus.dispatch("onGroupItemUpdated", this.stage, instance);
  };

  private onMouseLeave: KonvaNodeEvents["onMouseLeave"] = e => {
    e.cancelBubble = true;
  };

  private onMouseEnter: KonvaNodeEvents["onMouseEnter"] = e => {
    e.cancelBubble = true;
  };

  private onMouseDown: KonvaNodeEvents["onMouseDown"] = e => {
    const groupItem = e.target.findAncestor(`#${this.props.id}`, false, null);
    setMaxZindex(groupItem);
  };

  private onDragMove: KonvaNodeEvents["onDragMove"] = e => {
    e.cancelBubble = true;
    if (this.props.onDragMove) {
      this.props.onDragMove(e, this.props.item);
    }
  };

  private onDragStart: KonvaNodeEvents["onDragStart"] = e => {
    e.cancelBubble = true;
    if (this.props.onDragStart) {
      this.props.onDragStart(e, this.props.item);
    }
  };

  private onDragEnd: KonvaNodeEvents["onDragEnd"] = e => {
    e.cancelBubble = true;
    if (this.props.onDragEnd) {
      this.props.onDragEnd(e, this.props.item);
    }
  };

  private updateGroupOffset = () => {
    const { x, y } = this.groupContent.getClientRect({ relativeTo: this.stage });
    this.setState({ x, y });
  };

  private onGroupUpdated = (e, group: Konva.Group) => {
    if (e.target !== this.stage) return;
    const groupContent = group.findOne(".groupContent");
    if (groupContent && groupContent.id() === this.props.item.groupId) {
      this.updateGroupOffset();
    }
  };

  private onGroupDragStart = (e, group: Konva.Group) => {
    if (e.target !== this.stage) return;
    Eventbus.addEventListener("onGroupDragEnd", this.onGroupDragEnd, this.stage);
    const groupContent = group.findOne(".groupContent");
    if (groupContent && groupContent.id() === this.props.item.groupId) {
      this.setState({ dragging: true });
    }
  };

  private onGroupDragEnd = (e, group: Konva.Group) => {
    if (e.target !== this.stage) return;
    const groupContent = group.findOne(".groupContent");
    if (groupContent && groupContent.id() === this.props.item.groupId) {
      this.setState({ dragging: false });
    }
    Eventbus.removeEventListener("onGroupDragEnd", this.onGroupDragEnd, this.stage);
  };

  private showTooltip = (e: KonvaEventObject<MouseEvent>, key: keyof i18n) => {
    const stage = e.target.getStage();
    const { x, y, width } = e.target.getClientRect({ relativeTo: stage });
    this.props.showTooltip(x + width / 2, y, key);
  };

  private setItemRef = (instance: Konva.Group) => (this.item = instance);

  private get content() {
    const { item } = this.props;
    if (item.groupType !== "users") {
      return (
        <ListItem
          width={GROUP_ITEM_WIDTH}
          leftIcons={this.leftIcons}
          rightIcons={this.rightIcons}
          text={typeof item.data === "string" ? item.data : ""}
        />
      );
    }
    const { name, src, descr } = item.data as ItemDataUser;
    return (
      <UserItem
        x={0}
        y={-1}
        src={src}
        text={name}
        subText={descr}
        width={GROUP_ITEM_WIDTH}
        rightIcons={this.rightIcons}
      />
    );
  }
}
