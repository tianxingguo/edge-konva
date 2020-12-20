import {
  i18n,
  RoadmapGroup,
  RoadmapConfig,
  OnRoadmapChange,
  ExtRoadmapGroup,
  RoadmapGroupItem,
  RoadmapConnection,
  ExtRoadmapGroupItem
} from "../types";
import * as React from "react";
import { GroupsRenderer } from "./GroupsRenderer";
import { defaultRoadmapConfig } from "../constants";
import { StageDragOverlay } from "./StageDragOverlay";
import { Spring } from "react-spring/renderprops-konva";
import { TooltipContextProvider } from "./TooltipContext";
import { GroupItemsRenderer } from "./GroupItemsRenderer";
import { ConnectionsRenderer } from "./ConnectionsRenderer";
import { Stage, Layer, KonvaNodeEvents } from "react-konva";
import { UserItem } from "../../konva";

type Props = {
  i18n: i18n;
  live: boolean;
  width: number;
  height: number;
  draggable?: boolean;
  groups: RoadmapGroup[];
  onChange?: OnRoadmapChange;
  groupItems: RoadmapGroupItem[];
  config?: Partial<RoadmapConfig>;
  connections: RoadmapConnection[];
  onAddGroup?: (group: RoadmapGroup) => void;
  onAddGroupItem?: (group: RoadmapGroup) => void;
  onEditGroupItem: (groupItem: RoadmapGroupItem) => void;
};

type State = {
  config: RoadmapConfig;
  selectedItemId: string;
  hoveredItemIds: string[];
  hoveredItemNames: string[];
  groups: ExtRoadmapGroup[];
  groupItems: ExtRoadmapGroupItem[];
};

export class Roadmap extends React.PureComponent<Props> {
  state: State = {
    groups: [],
    config: null,
    groupItems: [],
    hoveredItemIds: [],
    hoveredItemNames: [],
    selectedItemId: null
  };

  private stage = React.createRef<any>();
  private readonly grab = ["groupContent", "groupItem"];
  private readonly pointer = ["connection", "icon", "button"];
  private readonly selector = "." + this.grab.join(", .") + ", ." + this.pointer.join(", .");

  static getDerivedStateFromProps(props: Props) {
    const config = {
      ...defaultRoadmapConfig,
      ...props.config
    };
    const groups = props.groups.map(group => ({
      ...group,
      position: config.itemPositions[group.id]
    }));
    const groupItems = props.groupItems
      .sort((a, b) => {
        return config.sortedGroupItemIds.indexOf(a.id) - config.sortedGroupItemIds.indexOf(b.id);
      })
      .map(groupItem => ({
        ...groupItem,
        position: config.itemPositions[groupItem.id],
        isHidden: config.hiddenGroupItemIds.indexOf(groupItem.id) !== -1
      }));
    return { config, groups, groupItems };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }

  render() {
    const { scale, position } = this.state.config;
    return (
      <Spring immediate={this.props.draggable} to={{ x: position.x, y: position.y }}>
        {({ x, y }) => (
          <Spring to={{ scaleX: scale.x, scaleY: scale.y }}>
            {({ scaleX, scaleY }) => this.renderContent(x, y, scaleX, scaleY)}
          </Spring>
        )}
      </Spring>
    );
  }

  private renderContent = (x: number, y: number, scaleX: number, scaleY: number) => (
    <Stage
      ref={this.stage}
      position={{ x, y }}
      width={this.props.width}
      onDragEnd={this.onDragEnd}
      height={this.props.height}
      onMouseOver={this.onMouseOver}
      onMouseDown={this.onMouseDown}
      draggable={this.props.draggable}
      scale={{ x: scaleX, y: scaleY }}
    >
      <Layer>
        <TooltipContextProvider i18n={this.props.i18n}>
          <ConnectionsRenderer
            groupItems={this.state.groupItems}
            connections={this.props.connections}
            selectedId={this.state.selectedItemId}
          />
          <GroupsRenderer
            live={this.props.live}
            groups={this.state.groups}
            onChange={this.props.onChange}
            groupItems={this.state.groupItems}
            selectedId={this.state.selectedItemId}
            onAddGroupItem={this.props.onAddGroupItem}
            hoveredItemIds={this.state.hoveredItemIds}
          />
          <GroupItemsRenderer
            live={this.props.live}
            groups={this.props.groups}
            items={this.state.groupItems}
            onChange={this.props.onChange}
            onEdit={this.props.onEditGroupItem}
            selectedId={this.state.selectedItemId}
            hoveredItemIds={this.state.hoveredItemIds}
          />
          <StageDragOverlay active={this.props.draggable} />
        </TooltipContextProvider>
      </Layer>
    </Stage>
  );

  // Maintain a cursor type
  private onMouseOver: KonvaNodeEvents["onMouseDown"] = e => {
    const nodes = e.target.findAncestors(this.selector, true, null);
    const foundNames = nodes.map(node => node.name());
    const foundIds = nodes.map(node => node.id()).filter(id => !!id);

    this.setState({
      hoveredItemIds: foundIds,
      hoveredItemNames: foundNames
    });

    // Curosr - pointer
    if (foundNames.some(name => this.pointer.indexOf(name) !== -1)) {
      if (foundNames.indexOf("button") !== -1) {
        this.stage.current.container().style.cursor = "pointer";
        return;
      }

      const indexOfIcon = foundNames.indexOf("icon");

      if (indexOfIcon !== -1 && !nodes[indexOfIcon].eventListeners.click) {
        this.stage.current.container().style.cursor = "grab";
        return;
      } else {
        this.stage.current.container().style.cursor = "pointer";
        return;
      }
    }

    // Curosr - Grab
    if (foundNames.some(name => this.grab.indexOf(name) !== -1)) {
      this.stage.current.container().style.cursor = "grab";
      return;
    }

    // Cursor - Move
    if (this.props.draggable) {
      this.stage.current.container().style.cursor = "move";
      return;
    }

    this.stage.current.container().style.cursor = "default";
  };

  private onMouseDown: KonvaNodeEvents["onMouseDown"] = e => {
    const { hoveredItemIds, hoveredItemNames, selectedItemId } = this.state;
    // Select item
    if (hoveredItemIds.length === 1 && hoveredItemIds[0] !== selectedItemId) {
      this.setState({ selectedItemId: hoveredItemIds[0] });
    }
    if (!hoveredItemIds.length && selectedItemId) {
      this.setState({ selectedItemId: null });
    }

    // Curosr - Grabbing
    if (hoveredItemNames.length !== 1) return;
    if (this.grab.indexOf(hoveredItemNames[0]) === -1) return;
    this.stage.current.container().style.cursor = "grabbing";
    this.stage.current.addEventListener("mouseup", this.onMouseUp);
  };

  private onMouseUp = () => {
    this.stage.current.container().style.cursor = "grab";
    this.stage.current.removeEventListener("mouseup", this.onMouseUp);
  };

  private onKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    if (this.state.selectedItemId && e.key === "Escape") {
      this.setState({ selectedItemId: null });
    }
  };

  private onDragEnd: KonvaNodeEvents["onDragEnd"] = e => {
    if (!this.props.onChange) return;
    const position = e.target.getStage().position();
    this.props.onChange("position", position);
  };
}
