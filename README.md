```JavaScript
import {CountDownText} from 'react-native-countdown-timer-text';

<CountDownText
    style={styles.cd}
    countType='seconds'
    auto={true}
    afterEnd={() => {}}
    timeLeft={10}
    step={-1}
    startText='Start'
    endText='End'
    intervalText={(sec) => sec + '秒重新获取'}
  />

<CountDownText
    style={styles.cd}
    countType='date'
    auto={true}
    afterEnd={() => {}}
    timeLeft={10}
    step={-1}
    startText=''
    endText=''
    intervalText={(date, hour, min, sec) => date + '天' + hour + '时' + min + '分' + sec}
  />
```