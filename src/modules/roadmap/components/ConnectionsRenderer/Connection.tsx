import Konva from "konva";
import * as React from "react";
import Eventbus from "eventbusjs";
import { ConnectionLine } from "../../../konva";
import { RoadmapConnection } from "../../types";

type State = {
  toXY: [number, number];
  fromXY: [number, number];
};

type Props = {
  selected: boolean;
} & RoadmapConnection;

export class Connection extends React.Component<Props> {
  state: State = {
    fromXY: [0, 0],
    toXY: [0, 0]
  };

  private line: Konva.Line;
  private stage: Konva.Stage;

  componentDidMount() {
    this.stage = this.line.getStage();
    this.setCoordinates();
    Eventbus.addEventListener("onGroupItemUpdated", this.onGroupItemUpdated, this.stage);
  }

  componentWillUnmount() {
    Eventbus.removeEventListener("onGroupItemUpdated", this.onGroupItemUpdated, this.stage);
  }

  render() {
    const { id, selected } = this.props;
    const { fromXY, toXY } = this.state;
    return (
      <ConnectionLine selected={selected} id={id} innerRef={this.setRef} from={fromXY} to={toXY} />
    );
  }

  private setCoordinates = () => {
    const nodeTo = this.stage.find("#" + this.props.toId)[0];
    const nodeFrom = this.stage.find("#" + this.props.fromId)[0];

    if (!nodeFrom || !nodeTo) return;

    const toRect = this.stage.find("#" + this.props.toId)[0].children[0];
    const fromRect: Konva.Group = this.stage.find("#" + this.props.fromId)[0].children[0];
    const from = fromRect.getClientRect({ relativeTo: this.stage });
    const to = toRect.getClientRect({ relativeTo: this.stage });

    this.setState({
      fromXY: [from.x + from.width, from.y + from.height / 2],
      toXY: [to.x, to.y + to.height / 2]
    });
  };

  private setRef = (instance: Konva.Line) => {
    this.line = instance;
  };

  private onGroupItemUpdated = (e, instance: Konva.Group) => {
    const { fromId, toId } = this.props;
    if (e.target !== this.stage || !instance.id) return;
    if (instance.id() !== fromId && instance.id() !== toId) return;
    this.setCoordinates();
  };
}
