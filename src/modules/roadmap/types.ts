import { Vector2d } from "konva/types/types";
export type RoadmapGroupType = "users" | "emails" | "phones" | "widgets" | "routings" | "groups";

// Group
export type RoadmapGroup = {
  id: string;
  name: string;
  column: number;
  type: RoadmapGroupType;
};

export type ExtRoadmapGroup = {
  position?: Vector2d;
} & RoadmapGroup;

// Group item
export type RoadmapGroupItem = {
  id: string;
  groupId: string;
  data: ItemDataUser | string;
  groupType: RoadmapGroupType;

  leftConnections?: number | true;
  rightConnections?: number | true;
};

export type ItemDataUser = {
  name: string;
  src?: string;
  descr: string;
};

export type ExtRoadmapGroupItem = {
  isHidden?: boolean;
  position?: Vector2d;
} & RoadmapGroupItem;

// Connection
export type RoadmapConnection = {
  id: string;
  toId: string;
  fromId: string;
};

export type RoadmapGroupItemPosition = {
  x: number;
  y: number;
};

// I18n
export type i18n = {
  edit: string;
  hide: string;
  showAll: string;
  resetPosition: string;
};

// Config
export type RoadmapConfig = {
  scale: Vector2d;
  position: Vector2d;
  itemPositions: {
    [key: string]: Vector2d;
  };
  hiddenGroupItemIds: string[];
  sortedGroupItemIds: string[];
};

export type OnChangeItemPositionProps = {
  id: string;
  position?: Vector2d;
};

export type OnRoadmapChangeProps = {
  scale: Vector2d;
  position: Vector2d;
  groupItemOrder: string[];
  groupItemVisibility: string | string[];
  itemPosition: OnChangeItemPositionProps | OnChangeItemPositionProps[];
};

export type OnRoadmapChange = <T extends keyof OnRoadmapChangeProps>(
  type: T,
  data: OnRoadmapChangeProps[T]
) => void;
