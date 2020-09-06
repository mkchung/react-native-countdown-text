import React, {memo, useState, useCallback, useEffect} from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';

interface CountDownTextProps {
  seconds: number; // 用于倒计时的秒数
  startText?: string;
  endText?: string;
  running: boolean; // 是否启动
  style?: StyleProp<TextStyle>;
  intervalText?: (remainSeconds: number) => string;
  afterEnd?: (remainSeconds?: number) => void;
}

const CountdownText: React.FC<CountDownTextProps> = (props) => {
  const {seconds = 60, startText = 'start', endText = 'restart', running = false} = props;
  const {intervalText = (remainSeconds: number) => `${remainSeconds}秒`, afterEnd, style = {}} = props;
  const [isRunning, setIsRunning] = useState<boolean>(running);
  const [currentText, setCurrentText] = useState<string>(startText);
  const handleCountdown = useCallback((): NodeJS.Timeout => {
    let intervalID: NodeJS.Timeout;
    let intervalSec = seconds;
    setCurrentText(intervalText(--intervalSec));
    intervalID = setInterval(() => {
      intervalSec--;
      setCurrentText(intervalText(intervalSec));

      if (intervalSec <= 0) {
        setCurrentText(endText || startText);
        setIsRunning(false);
        if (intervalID) {
          clearInterval(intervalID);
        }

        if (afterEnd) {
          afterEnd(intervalSec);
        }
      }
    }, 1000);

    return intervalID;
  }, [afterEnd, endText, intervalText, seconds, startText]);

  useEffect(() => {
    setIsRunning(running);
  }, [running]);

  useEffect(() => {
    let intervalID: NodeJS.Timeout | undefined;
    if (isRunning) {
      intervalID = handleCountdown();
    } else {
      setCurrentText(endText || startText);
      if (intervalID) {
        clearInterval(intervalID);
      }
    }

    return () => {
      if (intervalID) {
        clearInterval(intervalID);
      }
    };
  }, [endText, handleCountdown, isRunning, startText]);

  return <Text style={style}>{currentText}</Text>;
};

export default memo(CountdownText);
