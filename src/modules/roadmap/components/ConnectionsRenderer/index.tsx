import * as React from "react";
import equals from "ramda/src/equals";
import { Connection } from "./Connection";
import { RoadmapConnection, ExtRoadmapGroupItem } from "../../types";

type Props = {
  selectedId: string;
  groupItems: ExtRoadmapGroupItem[];
  connections: RoadmapConnection[];
};

type State = {
  canRender: boolean;
  visibleItemIds: string[];
};

export class ConnectionsRenderer extends React.Component<Props> {
  shouldComponentUpdate(prevProps: Props) {
    return !equals(this.props, prevProps);
  }

  static getDerivedStateFromProps(props: Props) {
    return {
      visibleItemIds: props.groupItems.filter(item => !item.isHidden).map(item => item.id)
    };
  }

  state: State = {
    canRender: false,
    visibleItemIds: []
  };

  componentDidMount() {
    this.forceUpdate();
    this.setState({ canRender: true });
  }

  render() {
    const { selectedId } = this.props;
    const { visibleItemIds: vitems } = this.state;
    if (!this.state.canRender) {
      return null;
    }
    return this.props.connections.map(c => {
      if (vitems.indexOf(c.toId) === -1 || vitems.indexOf(c.fromId) === -1) {
        return null;
      }
      return <Connection selected={selectedId === c.id} key={c.fromId + "" + c.toId} {...c} />;
    });
  }
}
