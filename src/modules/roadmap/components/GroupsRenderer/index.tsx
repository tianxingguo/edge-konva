import * as React from "react";
import { Group } from "./Group";
import equals from "ramda/src/equals";
import { config } from "../../constants";
import { getGroupItemHeight } from "../../helpers";
import { TooltipContextProps, TooltipContext } from "../TooltipContext";
import { OnRoadmapChange, ExtRoadmapGroup, ExtRoadmapGroupItem } from "../../types";

type Props = {
  live: boolean;
  selectedId: string;
  groups: ExtRoadmapGroup[];
  hoveredItemIds: string[];
  onChange?: OnRoadmapChange;
  groupItems: ExtRoadmapGroupItem[];
  onAddGroupItem: (group: ExtRoadmapGroup) => void;
};

export class GroupsRenderer extends React.Component<Props> {
  private readonly spaceY = config.spaceBetweenGroupsVertical;
  private readonly spaceX = config.spaceBetweenGroupsHorizontal;
  private readonly spaceBetweenItems = config.spaceBetweenGroupItems;
  private groupHeights: { [key: number]: number[] } = {};

  shouldComponentUpdate(prevProps: Props) {
    return !equals(this.props, prevProps);
  }

  render() {
    return <TooltipContext>{this.renderGroups}</TooltipContext>;
  }

  private renderGroups = (context: TooltipContextProps) => {
    this.groupHeights = [];

    const { groups, selectedId } = this.props;
    const { groupItemWidth, padding } = config;

    return groups.map(group => {
      if (!this.groupHeights[group.column]) {
        this.groupHeights[group.column] = [];
      }
      const { items, visibleItems } = this.getGroupItems(group);
      const height = this.getContentHeight(visibleItems) + padding * 2 + 32;
      const offsetX = (groupItemWidth + this.spaceX + padding * 2) * group.column;
      const offsetY = this.groupHeights[group.column].reduce((a, b) => {
        return a + b + this.spaceY;
      }, 0);
      const selected = selectedId === group.id;

      this.groupHeights[group.column].push(height);

      return (
        <Group
          id={group.id}
          group={group}
          key={group.id}
          height={height}
          offsetX={offsetX}
          offsetY={offsetY}
          groupItems={items}
          selected={selected}
          live={this.props.live}
          onChange={this.props.onChange}
          groupVisibleItems={visibleItems}
          showTooltip={context.showTooltip}
          hideTooltip={context.hideTooltip}
          onAddGroupItem={this.props.onAddGroupItem}
          hoveredItemIds={this.props.hoveredItemIds}
        />
      );
    });
  };

  private getGroupItems = (group: ExtRoadmapGroup) => {
    const visibleItems: ExtRoadmapGroupItem[] = [];
    const items = this.props.groupItems.filter(item => {
      if (item.groupId !== group.id) {
        return false;
      }
      if (!item.isHidden) {
        visibleItems.push(item);
      }
      return true;
    });
    return { items, visibleItems };
  };

  private getContentHeight = (visibleGroupItems: ExtRoadmapGroupItem[]) => {
    const { live } = this.props;
    return visibleGroupItems.reduce((prev, curr) => {
      return prev + getGroupItemHeight(curr, live) + this.spaceBetweenItems;
    }, 0);
  };
}
