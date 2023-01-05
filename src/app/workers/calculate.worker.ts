/// <reference lib="webworker" />

import { ComplexNb } from "../classes/complex-nb";
import { Pixel } from "../classes/pixel";
import { Color } from "../classes/color";
import { GraphicLibrary } from "../libraries/graphic-library";
import { Scene } from "../classes/scene";
import { Point } from "../classes/point";
import { JuliaFractal } from "../classes/julia-fractal";

addEventListener('message', ({ data }) => {
  //const response = `worker response to ${data}`;
  //postMessage(response);
  /**
   * canvasWidth
   * canvasHeight
   * currentScene
   * gradientStart
   * gradientEnd
   * fractal
   * COLOR_BACKGROUND
   */

  const canvasWidth = data.canvasWidth;
  const canvasHeight = data.canvasHeight;
  const currentScene = new Scene(
    data.currentScene.minX,
    data.currentScene.minY,
    data.currentScene.rangeX,
    data.currentScene.rangeY,
    new Point(data.currentScene.trans.x, data.currentScene.trans.y),
    data.currentScene.angle,
    data.currentScene.zoom
     );
  const gradientStart = data.gradientStart;
  const gradientEnd = data.gradientEnd;
  const fractal = new JuliaFractal(
    data.fractal.id,
    data.fractal.name,
    new ComplexNb(true, data.fractal.seed.real, data.fractal.seed.imag),
    data.fractal.limit,
    data.fractal.maxIt
  );
  const COLOR_BACKGROUND = data.COLOR_BACKGROUND

  //console.log('canvasWidth : ', canvasWidth);
  //console.log('canvasHeight : ', canvasHeight);
  //console.log('currentScene : ', currentScene);
  //console.log('gradientStart : ', gradientStart);
  //console.log('gradientEnd : ', gradientEnd);
  //.log('fractal : ', fractal);
  //console.log('COLOR_BACKGROUND : ', COLOR_BACKGROUND);


  const max = (canvasWidth * canvasHeight) - 1;
  let dataToSend: any = {};
  let cpt = 0;
  let jobPercent = 0;
  let pix = new Pixel(0, 0);
  let tabToDraw: Color[][] = new Array(canvasWidth);


  //console.log('tabToDraw', tabToDraw);

  //console.log('currentScene.getMinX()', currentScene.getMinX());

  for (let i = 0; i < canvasWidth; i++) {
    //console.log('i:', i);
    tabToDraw[i] = new Array<Color>(canvasHeight);

    for (let j = 0; j < canvasHeight; j++) {
      //console.log('j:', j);
      pix.setI(i);
      pix.setJ(j);
      let pointM = GraphicLibrary.calcPointFromPix(pix, currentScene, canvasWidth, canvasHeight);
      let z = new ComplexNb(true, pointM.getX(), pointM.getY());
      let colorPt = fractal.calcColorFromJuliaFractal(z, gradientStart, gradientEnd - gradientStart, COLOR_BACKGROUND);
      tabToDraw[pix.getI()][pix.getJToDraw(canvasHeight)] = colorPt;

      jobPercent = Math.round(100 * cpt / max);
/*
      if (jobPercent % 33 === 0) {
        dataToSend = {
          isJobDone: 'false',
          jobPercent: jobPercent
        }
        postMessage(dataToSend);
      }
      */
      cpt++;
    }
  }

  dataToSend = {
    isJobDone: 'true',
    jobPercent: jobPercent,
    tabToDraw: tabToDraw
  }
  //console.log('dataToSend : ', dataToSend);
  postMessage(dataToSend);
});
