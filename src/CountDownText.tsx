import React, {PureComponent} from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';
import CountDown from './CountDown';

interface CountDownTextProps {
  countType: 'seconds' | 'date';
  timeLeft: number;
  step: number;
  startText: string;
  endText?: string;
  endTime?: number;
  auto: boolean;
  style?: StyleProp<TextStyle>;
  intervalText?: (leftSec: number) => string;
  afterEnd?: (timePassed: number) => void;
}

interface CountDownTextState {
  text: string;
}

class CountDownText extends PureComponent<CountDownTextProps, CountDownTextState> {
  private counter: CountDown;

  constructor(props) {
    super(props);

    this.state = {
      text: this.props.startText,
    };
  }

  static defaultProps: CountDownTextProps = {
    countType: 'seconds',
    timeLeft: 0,
    step: -1,
    startText: '',
    intervalText: (leftSec: number) => `${leftSec}`,
    endText: '',
    auto: false,
    afterEnd: () => {},
  };

  static isTimeEquals(t1: number, t2: number): boolean {
    return Math.abs(t1 - t2) < 2;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let updating: boolean = true;

    // 倒计时的情况
    if (this.props.step === nextProps.step && this.props.step < 0) {
      if (this.props.endTime) {
        // 1. 按起始日期来计时
        updating = !CountDownText.isTimeEquals(this.props.endTime, nextProps.endTime);
      } else {
        // 2. 按间隔秒数来计时
        updating = !CountDownText.isTimeEquals(nextProps.timeLeft, this.counter.timePassed);
      }
    }

    if (updating) {
      // 重置： 清空计数 + 停止计时
      this.counter.reset();

      this.counter.setData(
        Object.assign({}, nextProps, {
          onInterval: this.onInterval.bind(this),
          onEnd: this.onEnd.bind(this),
        }),
      );

      if (nextProps.auto) {
        this.start();
      }
    }
  }

  componentDidMount() {
    this.counter = new CountDown(
      Object.assign({}, this.props, {
        onInterval: this.onInterval.bind(this),
        onEnd: this.onEnd.bind(this),
      }),
    );

    if (this.counter.timeLeft <= 0 && this.counter.step <= 0) {
      return this.end();
    }

    if (this.props.auto) this.start();
  }

  componentWillUnmount() {
    this.reset();
  }

  start() {
    this.counter.start();
  }

  end() {
    this.counter.end();
  }

  reset() {
    this.counter.reset();
  }

  render() {
    return <Text style={this.props.style}> {this.state.text} </Text>;
  }

  getTimePassed(): number {
    return this.counter.timePassed;
  }

  onInterval(...args) {
    if (this.props.intervalText) {
      this.setState({text: this.props.intervalText.apply(null, args)});
    }
  }

  onEnd(timePassed) {
    const {afterEnd, endText, startText} = this.props;
    this.setState({
      text: endText || startText,
    });

    if (afterEnd) {
      afterEnd(timePassed);
    }
  }
}

export default CountDownText;
