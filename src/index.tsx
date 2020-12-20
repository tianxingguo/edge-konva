import "./styles.css";
import * as React from "react";
import { render } from "react-dom";
import {
  i18n,
  RoadmapConfig,
  OnRoadmapChange,
  OnRoadmapChangeProps,
  OnChangeItemPositionProps
} from "./modules/roadmap/types";
import { defaultRoadmapConfig } from "./modules/roadmap/constants";
import { Roadmap, RoadmapGroup, RoadmapGroupItem, RoadmapConnection } from "./modules";

type State = {
  live: boolean;
  draggable: boolean;
  groups: RoadmapGroup[];
  groupItems: RoadmapGroupItem[];
  config?: Partial<RoadmapConfig>;
  connections: RoadmapConnection[];
};

class App extends React.Component {
  state: State = {
    live: false,
    draggable: false,
    config: JSON.parse( localStorage.getItem("abrakadabra")! ) || defaultRoadmapConfig,
    groups: [
      {
        column: 0,
        id: "widgets",
        type: "widgets",
        name: "Widgets"
      },
      {
        column: 0,
        id: "emails",
        type: "emails",
        name: "Emails"
      },
      {
        column: 0,
        id: "phones",
        type: "phones",
        name: "Phones"
      },
      {
        column: 1,
        id: "routings",
        type: "routings",
        name: "Routings"
      },
      {
        column: 2,
        id: "groups",
        name: "Groups",
        type: "groups"
      },
      {
        column: 1,
        id: "users",
        name: "Users",
        type: "users"
      }
    ],
    groupItems: [
      {
        id: "w1",
        data: "Widget 1",
        groupId: "widgets",
        rightConnections: 1,
        groupType: "widgets"
      },
      {
        id: "w2",
        data: "Widget 2",
        groupId: "widgets",
        rightConnections: 1,
        groupType: "widgets"
      },
      {
        id: "w3",
        data: "Widget 3",
        groupId: "widgets",
        rightConnections: 1,
        groupType: "widgets"
      },
      {
        id: "r1",
        groupId: "routings",
        groupType: "routings",
        leftConnections: true,
        data: "Some routing 1"
      },
      {
        id: "r2",
        groupId: "routings",
        groupType: "routings",
        leftConnections: true,
        data: "Some routing 2"
      },
      {
        id: "e1",
        groupId: "emails",
        groupType: "emails",
        leftConnections: true,
        data: "Email inbox 1"
      },
      {
        id: "g1",
        groupId: "groups",
        groupType: "groups",
        leftConnections: true,
        data: "Operator group 1"
      },
      {
        id: "g2",
        groupId: "groups",
        groupType: "groups",
        leftConnections: true,
        data: "Operator group 2"
      },
      {
        id: "p2",
        groupId: "phones",
        groupType: "phones",
        leftConnections: true,
        data: "Phone link 1"
      },
      {
        id: "u1",
        groupId: "users",
        groupType: "users",
        leftConnections: true,
        data: {
          name: "John Wick",
          descr: "ID: 00000",
          src: "https://konvajs.org/assets/yoda.jpg"
        }
      }
    ],
    connections: [
      {
        id: "w1.r1",
        fromId: "w1",
        toId: "r1"
      },
      {
        id: "w2.r1",
        fromId: "w2",
        toId: "r1"
      },
      {
        id: "w3.r2",
        fromId: "w3",
        toId: "r2"
      },
      {
        id: "r2.e1",
        fromId: "e1",
        toId: "r2"
      },
      {
        id: "r1.g2",
        fromId: "r1",
        toId: "g2"
      },
      {
        id: "r2.g1",
        fromId: "r2",
        toId: "g1"
      },
      {
        id: "r2.g3",
        fromId: "r2",
        toId: "g3"
      }
    ]
  };

  private readonly i18n: i18n = {
    hide: "Hide",
    edit: "Edit",
    showAll: "Show all",
    resetPosition: "Reset positions"
  };

  render() {
    return (
      <div className="App">
        <button onClick={this.addWidget} className="mr-2">
          Add widget
        </button>
        <button onClick={this.removeWidget} className="mr-2">
          Remove widget
        </button>
        <button onClick={this.toggleLive} className="mr-2">
          {this.state.live ? "Stop!" : "Live!"}
        </button>
        <button className="mr-2" onClick={() => this.resetAll()}>
          Reset all
        </button>
        <button onClick={this.minus} className="mr-2">
          minus
        </button>
        <button onClick={this.plus} className="mr-2">
          plus
        </button>
        <button onClick={this.toggleDraggable} className="mr-2">
          {this.state.draggable ? "stop drag" : "start drag"}
        </button>
        <Roadmap
          i18n={this.i18n}
          live={this.state.live}
          onChange={this.onChange}
          width={window.innerWidth}
          config={this.state.config}
          groups={this.state.groups}
          height={window.innerHeight}
          draggable={this.state.draggable}
          groupItems={this.state.groupItems}
          connections={this.state.connections}
          onAddGroupItem={this.onAddGroupItem}
          onEditGroupItem={this.onEditGroupItem}
        />
      </div>
    );
  }

  private onChange: OnRoadmapChange = (type, data) => {
    switch (type) {
      case "scale": {
        this.setState({
          config: {
            ...this.state.config,
            scale: data
          }
        });
        break;
      }
      case "position": {
        this.setState({
          config: {
            ...this.state.config,
            position: data
          }
        });
        break;
      }
      case "itemPosition": {
        const d = data as OnRoadmapChangeProps["itemPosition"];
        const itemPositions = { ...this.state.config?.itemPositions } || {};
        const manage = (item: OnChangeItemPositionProps) => {
          if (!item.position) {
            delete itemPositions[item.id];
          } else {
            itemPositions[item.id] = item.position;
          }
        };
        if (Array.isArray(d)) {
          for (const item of d) {
            manage(item);
          }
        } else {
          manage(d);
        }
        this.setState({
          config: {
            ...this.state.config,
            itemPositions
          }
        });
        break;
      }
      case "groupItemVisibility": {
        const d = data as OnRoadmapChangeProps["groupItemVisibility"];
        const hiddenGroupItemIds = [...this.state.config?.hiddenGroupItemIds] || [];

        const manage = (id: string) => {
          const index = hiddenGroupItemIds.indexOf(id);
          if (index !== -1) {
            hiddenGroupItemIds.splice(index, 1);
          } else {
            hiddenGroupItemIds.push(id);
          }
        };
        if (Array.isArray(d)) {
          for (const item of d) {
            manage(item);
          }
        } else {
          manage(d);
        }
        this.setState({
          config: {
            ...this.state.config,
            hiddenGroupItemIds
          }
        });
        break;
      }

      case "groupItemOrder": {
        this.setState({
          config: {
            ...this.state.config,
            sortedGroupItemIds: data
          }
        });
        break;
      }

      default:
        break;
    }
    localStorage.setItem("abrakadabra", JSON.stringify(this.state.config));
  };

  private onAddGroupItem = (g: RoadmapGroup) => console.log("Add item: ", g);

  private resetAll = () => {
    localStorage.removeItem("abrakadabra");
    this.setState({ config: defaultRoadmapConfig });
  };

  private onEditGroupItem = item => console.log("Edit item: ", item);

  private toggleLive = () => this.setState({ live: !this.state.live });

  private addWidget = () => {
    const id = (Math.random() * 100).toFixed(0);
    this.setState({
      groupItems: [
        ...this.state.groupItems,
        {
          groupId: "widgets",
          name: "Widget " + id,
          rightConnections: 1,
          groupType: "widgets",
          id: id
        }
      ]
    });
  };

  private removeWidget = () => {
    const newArray = [...this.state.groupItems];
    newArray.shift();
    this.setState({
      groupItems: newArray
    });
  };

  private plus = () => {
    const { x, y } = this.state.config?.scale;

    this.setState({
      config: {
        ...this.state.config,
        scale: {
          x: x + 0.2,
          y: y + 0.2
        }
      }
    });
  };

  private minus = () => {
    const { x, y } = this.state.config?.scale;
    this.setState({
      config: {
        ...this.state.config,
        scale: {
          x: x - 0.2,
          y: y - 0.2
        }
      }
    });
  };

  private toggleDraggable = () => this.setState({ draggable: !this.state.draggable });
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
