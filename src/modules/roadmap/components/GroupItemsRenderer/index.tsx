import {
  OnRoadmapChange,
  ExtRoadmapGroup,
  RoadmapGroupItem,
  ExtRoadmapGroupItem
} from "../../types";
import * as React from "react";
import equals from "ramda/src/equals";
import { GroupItemGroup, ExtendedRoadmapGroupItem } from "./GroupItemGroup";

type Props = {
  live: boolean;
  selectedId: string;
  hoveredItemIds: string[];
  groups: ExtRoadmapGroup[];
  onChange?: OnRoadmapChange;
  items: ExtRoadmapGroupItem[];
  onEdit: (groupItem: ExtendedRoadmapGroupItem) => void;
};

export class GroupItemsRenderer extends React.Component<Props> {
  shouldComponentUpdate(prevProps: Props) {
    return !equals(this.props, prevProps);
  }

  render() {
    const { onEdit, onChange } = this.props;
    const { groups, items, live, hoveredItemIds, selectedId } = this.props;

    return groups.map(group => {
      const visibleGroupItems = items.filter(item => item.groupId === group.id && !item.isHidden);
      return (
        <GroupItemGroup
          live={live}
          key={group.id}
          onEdit={onEdit}
          onChange={onChange}
          selectedId={selectedId}
          items={visibleGroupItems}
          onSortItem={this.onSortItem}
          hoveredItemIds={hoveredItemIds}
        />
      );
    });
  }

  private onSortItem = (fromItem: RoadmapGroupItem, toItem: RoadmapGroupItem) => {
    const oldIndex = this.props.items.indexOf(fromItem);
    const newIndex = this.props.items.indexOf(toItem);
    const ids = this.props.items.map(item => item.id);
    ids.splice(newIndex, 0, ids.splice(oldIndex, 1)[0]);
    this.props.onChange("groupItemOrder", ids);
  };
}
