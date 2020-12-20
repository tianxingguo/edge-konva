import Konva from "konva";
import { IconType } from "../konva/types";
import { RoadmapGroupItem, RoadmapGroupType } from "./types";
import {Container} from "konva/types/Container";

export const getGroupItemHeight = (groupItem: RoadmapGroupItem, live?: boolean) => {
  if (groupItem.groupType === "users") return 36 + 32;
  if (groupItem.groupType === "groups" && live) return 100;
  return 32;
};

export const getIconByGroupType = (groupType: RoadmapGroupType): IconType => {
  switch (groupType) {
    case "emails":
      return "envelope";
    case "phones":
      return "phone";
    case "routings":
      return "random";
    case "groups":
      return "users";
    case "widgets":
      return "archive";
    default:
      return null;
  }
};

export const getNodeBoundary = (node: Konva.Node) => {
  const stage = node.getStage();
  const rect = node.getClientRect({ relativeTo: stage });
  return {
    minX: rect.x,
    maxX: rect.x + rect.width,
    minY: rect.y,
    maxY: rect.y + rect.height
  };
};

export const isNodeInsideAGroup = (node: Konva.Node, group: Konva.Group) => {
  const gr = group.find(".groupContentRect")[0];
  if (!gr) return false;
  const { minX: nodeMinX, minY: nodeMinY, maxX: nodeMaxX, maxY: nodeMaxY } = getNodeBoundary(node);
  const { minX: grMinX, minY: grMinY, maxX: grMaxX, maxY: grMaxY } = getNodeBoundary(gr);
  const nodeWidth = nodeMaxX - nodeMinX;
  const nodeHeight = nodeMaxY - nodeMinY;

  return (
    grMinX < nodeMinX + nodeWidth / 2 &&
    nodeMaxX < grMaxX + nodeWidth / 2 &&
    nodeMaxY < grMaxY + nodeHeight / 2 &&
    grMinY < nodeMaxY - nodeHeight / 2
  );
};

export const getAbsouluteOffsetAofB = (a: Konva.Node, b: Konva.Node) => {
  const stage = a.getStage();
  const { x: ax, y: ay } = a.getClientRect({ relativeTo: stage });
  const { x: bx, y: by } = b.getClientRect({ relativeTo: stage });
  return { x: ax - bx, y: ay - by };
};

export const setMinZindex = (node: Konva.Node) => node.zIndex(0);
export const setMaxZindex = (node: Konva.Node) => node.zIndex(node.parent.children.length - 1);

export const sleep = (n: number) => new Promise(resolve => window.setTimeout(resolve, n));
