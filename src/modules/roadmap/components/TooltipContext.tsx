import * as React from "react";
import { i18n } from "../types";
import { Tooltip } from "../../konva";
import { Position } from "../../konva/types";

export type TooltipContextProps = {
  hideTooltip: () => void;
  showTooltip: (x: number, y: number, key: keyof i18n) => void;
};

const { Provider, Consumer } = React.createContext(null);
export const TooltipContext = Consumer;

type State = {
  show: boolean;
  i18nKey: keyof i18n;
} & Position;

type Props = {
  i18n: i18n;
};

export class TooltipContextProvider extends React.PureComponent<Props> {
  state: State = {
    x: 0,
    y: 0,
    show: false,
    i18nKey: null
  };

  render() {
    return (
      <Provider value={this.contextApi}>
        {this.props.children}
        <Tooltip {...this.state} />
      </Provider>
    );
  }

  private showTooltip: TooltipContextProps["showTooltip"] = (x, y, key) => {
    if (this.state.show) return;
    this.setState({ x, y, text: this.props.i18n[key], show: true });
  };

  private hideTooltip: TooltipContextProps["hideTooltip"] = () => {
    if (!this.state.show) return;
    this.setState({ show: false });
  };

  private get contextApi(): TooltipContextProps {
    return {
      showTooltip: this.showTooltip,
      hideTooltip: this.hideTooltip
    };
  }
}
