import { RoadmapConfig } from "./types";

export const GROUP_ITEM_WIDTH = 200;
export const SPACE_BETWEEN_GROUPS_ITEMS = 8;
export const SPACE_BETWEEN_GROUPS_VERTICAL = 64;
export const SPACE_BETWEEN_GROUPS_HORIZONTAL = 64;

export const config = {
  padding: 16,
  groupItemWidth: 200,
  spaceBetweenGroupItems: 8,
  spaceBetweenGroupsVertical: 64,
  spaceBetweenGroupsHorizontal: 64
};

export const defaultRoadmapConfig: RoadmapConfig = {
  itemPositions: {},
  sortedGroupItemIds: [],
  hiddenGroupItemIds: [],
  scale: { x: 1, y: 1 },
  position: { x: 48, y: 48 }
};
