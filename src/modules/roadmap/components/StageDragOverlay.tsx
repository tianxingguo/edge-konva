import Konva from "konva";
import * as React from "react";
import { Rect } from "react-konva";
import {Container} from "konva/types/Container";

type Props = {
  active: boolean;
};

export class StageDragOverlay extends React.PureComponent<Props> {
  state = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };

  private rect = React.createRef<Konva.Rect>();

  componentDidMount() {
    this.configure();
  }

  componentDidUpdate() {
    this.configure();
  }

  render() {
    return <Rect visible={this.props.active} ref={this.rect} {...this.state} />;
  }

  private configure = () => {
    if (!this.rect.current || !this.props.active) return;
    const stage: Konva.Stage = this.rect.current.getStage();
    this.setState({ ...stage.getLayers()[0].getClientRect({ relativeTo: stage }) });
  };
}
