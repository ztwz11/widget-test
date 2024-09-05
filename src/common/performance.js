import { control } from "../common/control";

const performanceMeasures = {};
let globalStartTime = null;
let globalEndTime = null;

export const startGlobalMeasure = () => {
  globalStartTime = performance.now();
};

export const endGlobalMeasure = () => {
  if (globalStartTime !== null) {
    const duration = performance.now() - globalStartTime;
    console.log(`Total loading time: ${duration.toFixed(2)}ms`);
    globalStartTime = null;
    globalEndTime = duration;

    control
      .getWidget("timestamp")
      .setValue("loading time :" + getGlobalLoadTime());
    return duration;
  }
  return null;
};

export const getGlobalLoadTime = () => {
  return globalEndTime;
};

export const startMeasure = (label) => {
  performanceMeasures[label] = {
    start: performance.now(),
    end: null,
    duration: null,
  };
};

export const endMeasure = (label) => {
  if (performanceMeasures[label]) {
    performanceMeasures[label].end = performance.now();
    performanceMeasures[label].duration =
      performanceMeasures[label].end - performanceMeasures[label].start;
  }
};

export const getMeasure = (label) => {
  return performanceMeasures[label];
};

export const getAllMeasures = () => {
  return performanceMeasures;
};

export const clearMeasures = () => {
  Object.keys(performanceMeasures).forEach(
    (key) => delete performanceMeasures[key]
  );
};

export const logMeasure = (label) => {
  const measure = getMeasure(label);
  if (measure) {
    console.log(`${label}: ${measure.duration.toFixed(2)}ms`);
  } else {
    console.log(`No measure found for ${label}`);
  }
};

export const logAllMeasures = () => {
  Object.entries(getAllMeasures()).forEach(([label, measure]) => {
    console.log(`${label}: ${measure.duration.toFixed(2)}ms`);
  });
};
