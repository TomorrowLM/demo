import { CHART_TYPE } from '@enum/dashboard';

const initFormatParams = { numFormat: 0, scale: 2, isThousandth: 0 };

const paddingConfig = [
  {
    text: '上',
    key: 'top'
  },
  {
    text: '右',
    key: 'right'
  },
  {
    text: '下',
    key: 'bottom'
  },
  {
    text: '左',
    key: 'left'
  }
]

const labelYConfig = [CHART_TYPE.HISTOGRAM, CHART_TYPE.STACK_HISTOGRAM, CHART_TYPE.STACK_PERCENT_HISTOGRAM, CHART_TYPE.LINE, CHART_TYPE.HISTOGRAM_LINE, CHART_TYPE.HISTOGRAM_STACK_LINE, CHART_TYPE.AREA, CHART_TYPE.STACK_AREA, CHART_TYPE.POINT, CHART_TYPE.BAR, CHART_TYPE.STACK_BAR, CHART_TYPE.STACK_PERCENT_BAR,]

const titleConfig = {
  show: true,
  text: '',
  style: {
    fontWeight: 'bold',
    fontSize: 16,
    fill: '#23242D',
    textAlign: 'left'
  }
}

const optionConfig = {
  shape: 'smooth',
  drillDown: {
    show: false
  },
  targetRange: '4,5',
  structureType: false,
  // 图表padding
  padding: {
    top: 20,
    right: 10,
    bottom: 10,
    left: 10,
  },
  map: {
    color: '#7979f5',
    animate: false,
    unknownArea: true,
    showText: true,
    displayType: 1,
  },
  // 图例配置
  legend: {
    show: false,
    position: 'top',
    flipPage: true,
    style: {
      fontWeight: 'normal',
      fontSize: 12,
      fill: '#65656C',
    }
  },
  // 图表标签配置
  annotationText: {
    showType: false, // 类别
    showNumber: false,  // 数值
    showProportion: true,  //  占比
    position: 'top',
    style: {
      // textAlign: 'center',
      fontWeight: 'normal',
      fontSize: 12,
      fill: '#9C9CA0',
    }
  },
  // 指标卡图表标签数值配置
  cardText: {
    style: {
      fontSize: 56,
      fontWeight: 'bold',
      fill: '#23242D',
    }
  },
  coordinate: {
    showHollow: true,
    radius: 0.8,
    innerRadius: 76,
  },
  style: {
    // 雷达图面积填充
    showArea: false,
    // 雷达图面积填充透明度
    fillOpacity: 20,
    paletteQualitative: ['#6544EB', '#447AEB', '#4AB873', '#E6B73F', '#EC6533', '#CC3BB4', '#4452EB', '#42A4B8', '#68AD57', '#C7BF58', '#EA4463', '#9C3BCC'].join('-')
  },
  axis: {
    line: {
      show: true,
      style: {
        stroke: 'rgba(233, 233, 235, 1)',
        lineWidth: 1
      }
    },
    xLabel: {
      show: true,
      style: {
        fontWeight: 'normal',
        fontSize: 12,
        fill: '#909399',
      },
    },
    yLabel: {
      show: true,
      scale: {
        nice: 0,
        min: 0,
        max: 0,
      },
      style: {
        fontWeight: 'normal',
        fontSize: 12,
        fill: '#909399',
      }
    },
    grid: {
      show: true,
      line: {
        style: {
          stroke: 'rgba(233, 233, 235, 1)',
          lineWidth: 1
        }
      },
      alignTick: false
    }
  },
  // x轴配置
  xAxis: {
    line: {
      show: true,
      style: {
        stroke: '#DEDEE0',
        lineWidth: 1,
      }
    },
    label: {
      show: true,
      scale: {
        nice: 0,
        min: 0,
        max: 0,
      },
      style: {
        fontWeight: 'normal',
        fontSize: 12,
        fill: '#909399',
      }
    },
    // 网格线配置
    grid: {
      show: false,
      line: {
        style: {
          stroke: 'rgba(233, 233, 235, 1)',
          lineWidth: 1,
          lineDash: [5, 5],
          fill: '#E9E9EA'
        }
      },
      alignTick: false
    },
    // 轴标题配置
    title: {
      show: false,
      content: '',
      offset: 30,
      style: {
        fill: '#65656C',
        fontSize: 12,
        fontWeight: 'normal',
      },
    }
  },
  // y轴配置
  yAxis: {
    line: {
      show: true,
      style: {
        stroke: '#DEDEE0',
        lineWidth: 1,
      }
    },
    label: {
      show: true,
      scale: {
        nice: 0,
        min: 0,
        max: 0,
      },
      style: {
        fontWeight: 'normal',
        fontSize: 12,
        fill: '#909399',
      }
    },
    // 网格线配置
    grid: {
      show: false,
      line: {
        style: {
          stroke: 'rgba(233, 233, 235, 1)',
          lineWidth: 1,
          lineDash: [5, 5],
          fill: '#E9E9EA'
        }
      },
      // alignTick: false
    },
    // 轴标题配置
    title: {
      show: false,
      content: '',
      offset: 40,
      style: {
        fill: '#65656C',
        fontSize: 12,
        fontWeight: 'normal',
      },
    }
  },
  zAxis: {
    line: {
      show: true,
      style: {
        stroke: 'rgba(233, 233, 235, 1)',
        lineWidth: 1
      }
    },
    label: {
      show: true,
      scale: {
        nice: 0,
        min: 0,
        max: 0,
      },
      style: {
        fontWeight: 'normal',
        fontSize: 12,
        fill: '#909399',
      }
    },
    grid: {
      show: false,
      line: {
        style: {
          stroke: 'rgba(233, 233, 235, 1)',
          lineWidth: 1
        }
      },
      // alignTick: false
    },
    title: {
      show: false,
      content: '',
      offset: 40,
      style: {
        fill: '#303133',
        fontSize: 12,
        fontWeight: 'normal',
      },
    }
  },
  // 象限配置
  quadrant: {
    show: false,
    showExplain: false,
    value: '',
    xAxis: {
      type: 1,
      value: 0
    },
    yAxis: {
      type: 1,
      value: 0
    },
    first: {
      color: '#6544EB',  // 象限背景颜色
      content: ''   // 象限名称
    },
    second: {
      color: '#447AEB',
      content: ''
    },
    third: {
      color: '#4AB873',
      content: ''
    },
    fourth: {
      color: '#E6B73F',
      content: ''
    }
  },
  wordCloud: {
    type: 'cloud'
  },
  // 仪表盘数值范围
  numberRange: {
    min: -100,
    max: 100,
  },
  // 柱形图宽度
  histogramConfig: {
    showHistogramRadius: false,
    histogramWidth: 16,
    histogramRadius: 4,
    columnWidthRatio: 0.5
  },
  // 滚动条
  scrollbar: {
    show: true,
    type: 'horizontal'
  }
}

const chartConfig = {
  initFormatParams,
  paddingConfig,
  labelYConfig,
  titleConfig,
  optionConfig
}

export default chartConfig;