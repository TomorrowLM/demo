// import { GRAPH_TYPE, CONTROL_TYPE, CHART_TYPE } from '@enum/dashboard';
import chartConfig from './const';
const { STACK_PERCENT_HISTOGRAM, STACK_PERCENT_BAR, HISTOGRAM_LINE, HISTOGRAM_STACK_LINE, POINT, RECTANGULAR_TREE, PIE, WORD_CLOUD } = CHART_TYPE;
const { initFormatParams, labelYConfig } = chartConfig;

/**
 * 柱状图 = 1；
 * 堆积柱状图 = 2；
 * 百分比堆积柱状图 = 3；
 * 条形图 = 4；
 * 堆积条形图 = 5；
 * 百分比堆积条形图 = 6；
 * 柱状折线图 = 7；
 * 堆积柱状折线图 = 8；
 * 折线图 = 9；
 * 面积图 = 10；
 * 堆积面积图 = 11；
 * 饼图 = 12；
 * 雷达图 = 13；
 * 散点图 = 14；
 * 计量表 = 15；
 * 指标卡 = 16；
 * 表格 = 17；
 * 词云图 = 18；
 * 气泡地图 = 19；
 * 地图 = 20；
 * 矩形树图 = 21；
 * 热力图 = 22
 */
 export enum CHART_TYPE {
  HISTOGRAM = 1,
  STACK_HISTOGRAM = 2,
  STACK_PERCENT_HISTOGRAM = 3,
  BAR = 4,
  STACK_BAR = 5,
  STACK_PERCENT_BAR = 6,
  HISTOGRAM_LINE = 7,
  HISTOGRAM_STACK_LINE = 8,
  LINE = 9,
  AREA = 10,
  STACK_AREA = 11,
  PIE = 12,
  RADAR = 13,
  POINT = 14,
  METERING = 15,
  TARGET = 16,
  TABLE = 17,
  WORD_CLOUD = 18,
  BUBBLE_MAP = 19,
  MAP = 20,
  RECTANGULAR_TREE = 21,
  HEAT_MAP = 22,
}

/**
 * 仪表盘类型
 */
export enum GRAPH_TYPE{
  CONTROL = 1,
  MODEL = 2
}

/**
 * 控件类型
 */
export enum CONTROL_TYPE{
  CHART = 1,
  TEXT = 2,
  FILTER = 3,
  SATISFACTION = 4,
  IMPORTANT = 5,
  NPS = 6
}

/**
 * 选择状态
 */
export enum CHECK_STATUS{
  CHECK = 1, // 已选
  UN_CHECK = 2, // 未选
  NOT_CHECK = 3, // 不可选
}

export enum QUADRANT_AXIS_STATUS{
  AVER = 1, // 平均值
  FIXED = 2, // 固定值
}
/**
 * 设置千位分隔符
 * @param num 数字
 * @returns 
 */
const numThousandth = (num: string) => {
  const nums = num.split('.'); // 分隔小数点
  const reverseNums = nums[0].split('').reverse(); // 转换成字符数组并且倒序排列
  let res: any[] | string = [];
  for(var i = 0, len = reverseNums.length; i < len; i++){
    if(i%3 === 0 && i !== 0){
      res.push(','); // 添加分隔符
    }
    res.push(reverseNums[i]);
  }
  res.reverse(); // 再次倒序成为正确的顺序

  if(nums[1]){  // 如果有小数的话添加小数部分
    res = res.join('').concat('.' + nums[1]);
  }else{
    res = res.join('');
  }
  return res;
}

/**
 * 数字格式化
 * @param num 数字
 * @param scale 保留位数
 * @param isThousandth 是否使用千位分隔符
 * @returns 
 */
const numFormatFun = (number: number, numFormat = 0, scale = 2, isThousandth = 0, type: 'number' | 'percent', isFormat: boolean): string => {
  let n : string = '';
  if (number !== null && number !== undefined) {
    const num1 = type === 'number' && numFormat === 1 ? number * 100 : number;
    const num2 = `${num1.toFixed(isFormat ? scale : 0)}${numFormat === 0 ? '' : '%'}`;
    n = isThousandth && numFormat === 0 ? numThousandth(num2) : num2;
  }
  
  return n;
}

const getFormatNum = (type: 'percent' | 'number', value, chartIds?: { xids?: any[], yids?: any[], zids?: any[] }) => {
  const { yids } = chartIds || {};
  const { numFormat, scale, isThousandth } = yids ? yids[0] : initFormatParams;
  return numFormatFun(value, numFormat, scale, isThousandth, type, true);
}

/**
 * 度量配置
 * @param chart 图表实例
 * @param field 展示字段
 * @param scaleOption 配置项
 */
const scaleConfig = (chart: any, field: 'percent' | 'y' | 'x' | 'z', scaleOption?: object) => {
  const option: any = {
    nice: true,
    min: 0,
    ...scaleOption,
  }
  if (field === 'percent') {
    option.formatter = (val) => {
      return (val * 100).toFixed(2) + '%'
    }
  }
  chart.scale(field, option);
}

const getAxisScale = (chartType: number, xAxis, yAxis) => {
  const scaleY = yAxis?.label?.scale, scaleX = xAxis?.label?.scale
  const nice = labelYConfig.includes(chartType) && yAxis !== null ? (scaleY?.nice !== 1 || (!scaleY?.max && !scaleY?.min)) : (scaleX?.nice !== 1 || (!scaleX?.max && !scaleX?.min));
  const min = labelYConfig.includes(chartType) && yAxis !== null ? scaleY?.min : scaleX?.min;
  const max = labelYConfig.includes(chartType) && yAxis !== null ? scaleY?.max : scaleX?.max;
  const minMax = nice ? {} : { min: min || min * 1 === 0 ? min * 1 : 0, max: max || max * 1 === 0 ? max * 1 : 0 };
  
  return { nice, ...minMax };
}

/**
 * 坐标轴配置
 * @param chart 图表实例
 * @param field 展示字段
 * @param axisOption 配置项
 */
const axisConfig = (chart: any, field: string, axisOption: any, position?: string) => {
  const option: any = {
    line: axisOption?.line?.show ? axisOption.line : null,
    label: axisOption?.label?.show ? { autoRotate: true, autoHide: false, ...axisOption.label, formatter: (text: string) => {
      return text.length > 10 ? `${text.slice(0, 10)}...` : text;
    } } : null,
    grid: axisOption?.grid?.show ? axisOption.grid : null,
    title: axisOption?.title?.show && axisOption?.title?.content ? axisOption.title : null,
  }
  if (position) {
    option.position = position;
  }
  chart.axis(field, option);
}

/**
 * G2 plot 坐标轴配置
 * @param xAxisOption x轴配置项
 * @param yAxisOption y轴配置项
 * @param zAxisOption y次轴配置项
 */
const plotAxisConfig = (xAxisOption: any, yAxisOption: any, zAxisOption: any) => {
  const option: any = (o) => {
    return {
      line: o?.line?.show ? o.line : null,
      label: o?.label?.show ? o.label : null,
      grid: o?.grid?.show ? o.grid : null,
      title: o?.title?.show && o?.title?.content ? { ...o.title, text: o.title.content } : null,
      // min: 0,
      tickCount: 6
    }
  }
  return {
    xAxis: option(xAxisOption),
    yAxis: {
      y: option(yAxisOption),
      z: option(zAxisOption),
    }
  }
}

/**
 * 图例配置
 * @param chart 图表实例
 * @param field 展示字段
 * @param legendOption 配置项
 */
const legendConfig = (chart: any, field: string, legendOption: any, maxLength = 10) => {
  chart.legend(field,
    legendOption.show ? {
      itemName: {
        style: legendOption.style,
        formatter: (text) => {
          return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        }
      },
      position: legendOption.position
    } : false
  );
}

/**
 * G2 plot 图例配置
 * @param option 配置项
 */
const plotLegendConfig = (option: any) => {
  if (!option.show) return false;
  return {
    position: option.position,
    itemName: {
      style: option.style,
    }
  };
}

/**
 * 缩略轴配置
 * @param chart 图表实例
 * @param data 图表数据源
 */
const sliderConfig = (chart: any, data: any[]) => {
  data.length > 50 && chart.option('slider', {
    start: 1 - (5 / data.length),
    end: 1,
    formatter: () => {
      return undefined
    }
  });
}

/**
 * G2 plot 缩略轴配置
 * @param data 图表数据源
 */
const plotSliderConfig = (data: any[]) => {
  return data.length > 100 ? {
    start: 1 - (5 / data.length),
    end: 1,
    formatter: () => {
      return undefined
    }
  } : undefined
};

/**
 * 滚动条配置
 * @param data 
 * @returns 
 */
const scrollBarConfig = (chart: any, data: any[], scrollbar: any, ) => {
  data.length > 50 && chart.option('scrollbar', scrollbar);
};

/**
 * 格式化数字格式
 * @param item 当前条数据 
 * @param field 字段key
 * @param types 图标类型集合 graphType: 模型类型, controlType: 控件类型, chartType: 图表类型
 * @param chartIds 维度和度量集合 xids: 维度, yids: 度量X, zids: 度量Y
 * @returns 
 */
const computeNum = (data: {
  item: any,
  field?: string,
  types?: { graphType?: number, controlType?: number, chartType?: number },
  chartIds?: { xids?: any[], yids?: any[], zids?: any[] }
  isFormat?: boolean
}) => {
  const { item = {}, field = 'y', isFormat = true, chartIds = {}, types = {} } = data;
  const { controlType, chartType } = types;
  const { yids, zids } = chartIds;
  const { i, zi, y, z, percent } = item;
  const isByHundred = [STACK_PERCENT_HISTOGRAM, STACK_PERCENT_BAR, PIE].includes(chartType || 0) || [CONTROL_TYPE.NPS, CONTROL_TYPE.SATISFACTION].includes(controlType || 0);
  const isCombinationChart = [HISTOGRAM_LINE, HISTOGRAM_STACK_LINE].includes(chartType || 0)

  const { numFormat: yNumFormat, scale: yScale, isThousandth: yIsThousandth, advancedType: yAdvancedType } = yids?.find(({ coordId }) => coordId === i) || initFormatParams;
  const { numFormat: zNumFormat, scale: zScale, isThousandth: zIsThousandth, advancedType: zAdvancedType } = zids?.find(({ coordId }) => coordId === (isCombinationChart ? i : zi)) || initFormatParams;
  const type = (field === 'y' ? yAdvancedType === 2 : zAdvancedType === 2) || [STACK_PERCENT_HISTOGRAM, STACK_PERCENT_BAR].includes(chartType || 0) || percent ? 'percent' : 'number';
  const getPercentContent = (format = yNumFormat) => numFormatFun(
    isByHundred
    ? percent * 100
    : (yAdvancedType === 2 || zAdvancedType === 2) && format === 0
    ? percent / 100
    : percent
    , (type === 'percent' && !(yAdvancedType === 2 || zAdvancedType === 2) && format === 0) ? 1 : format, yScale, yIsThousandth, 'percent', isFormat
  );

  const numContent = field === 'yz'
  ? `${numFormatFun(y, yNumFormat, yScale, yIsThousandth, type, isFormat)}，${numFormatFun(z, zNumFormat, zScale, zIsThousandth, type, isFormat)}`
  : field === 'y'
  ? numFormatFun(item[field], yNumFormat, yScale, yIsThousandth, type, isFormat)
  : numFormatFun(item[field], zNumFormat, zScale, zIsThousandth, type, isFormat);

  return {
    type,
    getPercentContent,
    numContent
  }
}

/**
 * 提示配置
 * @param chart 图表实例
 * @param tooltipType 使用图标图型'G2' | 'G2PLOT'
 * @param field 字段key
 * @param options 配置项
 * @param types 图标类型集合 graphType: 模型类型, controlType: 控件类型, chartType: 图表类型
 * @param chartIds 维度和度量集合 xids: 维度, yids: 度量X, zids: 度量Y
 */
const tooltipConfig = (config: {
  chart: any,
  tooltipType?: 'G2' | 'G2PLOT',
  field?: string,
  options?: object,
  types?: { graphType?: number, controlType?: number, chartType?: number },
  chartIds?: { xids?: any[], yids?: any[], zids?: any[] },
  isFormat?: boolean
}) => {
  const { chart, tooltipType = 'G2', field = 'y', isFormat = true, options = {}, types = {}, chartIds = {} } = config;
  const { chartType } = types;

  const opt = {
    showTitle: true,
    showMarkers: false,
    enterable: true,
    customItems: (items) => {
      if (isFormat) {
        items.forEach(item => {
          const { data } = item;
          const { type, getPercentContent, numContent } = computeNum({
            item: (tooltipType === 'G2PLOT' && chartType === WORD_CLOUD) ? data.datum : data,
            field: data[field] !== undefined ? field : 'z',
            types,
            chartIds
          });
  
          if (type === 'percent') {
            item.value = getPercentContent();
          } else {
            item.value = numContent;
          }
        });
      }
      return items;
    },
    domStyles: {
      'g2-tooltip': {
        background: '#23242D'
      },
      'g2-tooltip-title': {
        color: '#DEDEE0',
        fontSize: '12px'
      },
      'g2-tooltip-list-item': {
        color: '#DEDEE0',
        fontSize: '12px'
      },
      'g2-tooltip-name': {
        fontSize: '12px',
        color: '#DEDEE0'
      },
      'g2-tooltip-value': {
        color: '#fff',
        fontSize: '14px',
        fontWeight: 'blod',
        fontFamily: 'helvetica'
      }
    },
    ...options
  }
  return tooltipType === 'G2' ? chart.tooltip(opt) : opt;
}

/**
 * 文字配置
 * @param geometry 几何图型
 * @param labelType 使用图标图型'G2' | 'G2PLOT'
 * @param annotationText 配置项
 * @param offset 偏移量
 * @param field 字段key
 * @param isPercent 是否使用·percent·字段显示百分比
 * @param types 图标类型集合 graphType: 模型类型, controlType: 控件类型, chartType: 图表类型
 * @param chartIds 维度和度量集合 xids: 维度, yids: 度量X, zids: 度量Y
 * @param options 配置项
 */
const labelConfig = (config: {
  geometry: any,
  labelType?: 'G2' | 'G2PLOT',
  annotationText: any,
  offset?: number,
  field?: string,
  isPercent?: boolean,
  isFormat?: boolean,
  types?: { graphType?: number, controlType?: number, chartType?: number },
  chartIds?: { xids?: any[], yids?: any[], zids?: any[] },
  options?: any
}) => {
  const { geometry, labelType = 'G2', annotationText, offset = 0, field = 'y', isPercent = true, isFormat = true, types = {}, chartIds = {}, options = {} } = config;
  const { graphType, controlType, chartType } = types;
  
  if (annotationText.showType || annotationText.showNumber || annotationText.showProportion) {
    const opt = {
      position: annotationText.position,
      offset: annotationText.position === 'middle' ? 0 : annotationText.position === 'start' ? -20 : offset,
      content: (item) => {
        let content: string | number = '';
        const { x, ts, t, s } = item;
        const typeContent = (chartType === POINT && controlType === CONTROL_TYPE.CHART) || chartType === RECTANGULAR_TREE ? x : ts || t || s;
        const { type, getPercentContent, numContent } = computeNum({ item, field, types, chartIds, isFormat });

        if (annotationText.showType && annotationText.showNumber) { // 显示类别和数值
          if (type === 'percent' && isPercent) {
            content = `${typeContent}: ${getPercentContent()}`;
          } else {
            content = `${typeContent}: ${graphType === GRAPH_TYPE.MODEL ? item[field] : numContent}`;
          }
        } else if (annotationText.showType) { // 显示类别
          content = typeContent;
        } else if (annotationText.showNumber) { // 显示数值
          if (type === 'percent' && isPercent) {
            content = getPercentContent();
          } else {
            content = graphType === GRAPH_TYPE.MODEL ? item[field] : numContent;
          }
        }
        if (annotationText.showProportion && chartType === PIE) { // 饼图显示占比
          content += `\n （${getPercentContent(1)}）`
        }
        return content;
      },
      style: annotationText.style,
      layout: {
        type: chartType === RECTANGULAR_TREE ? 'limit-in-shape' : '',
      },
      ...options
    }
    return labelType === 'G2' ? geometry.label(field, opt) : opt;
  }
  return labelType === 'G2' ? geometry.label(false) : null;
}

/**
 * 设置主题色
 * @param chart 图表实例
 * @param paletteQualitative 色版值
 */
const themeConfig = (chart, paletteQualitative, maxColumnWidth = 100, columnWidthRatio?, scrollbarShow?) => {
  const paletteQualitativeArr = paletteQualitative.split('-');
  chart.theme({
    styleSheet: { "brandColor": paletteQualitativeArr[0], "paletteQualitative10": paletteQualitativeArr, "paletteQualitative20": paletteQualitativeArr },
    columnWidthRatio: columnWidthRatio ? (1 - columnWidthRatio).toFixed(2) : 0, // 一般柱状图宽度占比，0 - 1 范围数值
    maxColumnWidth: 64,
    minColumnWidth: scrollbarShow ? undefined : 16
  });
}

/**
 * 钻取
 * @param chart 图表实例
 * @param show 是否可钻取
 * @param fn 回调函数
 */
const drillDownConfig = (chart, name: string, show: boolean, fn: Function) => {
  show && chart.interaction(`element-active`, {
    start: [{ trigger: `element:mouseenter`, action: 'cursor:pointer' }],
    end: [{ trigger: `element:mouseleave`, action: 'cursor:default' }]
  });

  chart.on(`${name}:click`, (e) => {
    show && fn(e.data.data);
  });
}

/**
 * G2 plot 钻取
 * @param chart 图表实例
 * @param show 是否可钻取
 * @param fn 回调函数
 */
const plotDrillDownConfig = (chart, show: boolean, fn: Function) => {
  chart.on('element:click', (e) => {
    show && fn(e.data.data.x);
  });
}

const chartGeneral = {
  numThousandth,
  numFormatFun,
  getFormatNum,
  scaleConfig,
  getAxisScale,
  axisConfig,
  plotAxisConfig,
  legendConfig,
  plotLegendConfig,
  sliderConfig,
  plotSliderConfig,
  computeNum,
  tooltipConfig,
  labelConfig,
  themeConfig,
  drillDownConfig,
  plotDrillDownConfig,
  scrollBarConfig
}

export default chartGeneral;