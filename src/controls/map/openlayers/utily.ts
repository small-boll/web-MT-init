/*
 * @Author: your name
 * @Date: 2020-07-06 16:01:38
 * @LastEditTime: 2020-07-29 16:10:38
 * @LastEditors: Please set LastEditors
 * @Description:  工具操作类
 * @FilePath: \mthanos\src\controls\map\openlayers\getVectorContext.ts
 */
import { multiply as multiplyTransform } from 'ol/transform';
import CanvasImmediateRenderer from 'ol/render/canvas/Immediate';
export class utily {

  public getVectorContext(event: any) {
    const frameState = event.frameState;
    const transform = multiplyTransform(event.inversePixelTransform.slice(), frameState.coordinateToPixelTransform);
    return new CanvasImmediateRenderer(
      event.context, frameState.pixelRatio, frameState.extent, transform,
      frameState.viewState.rotation
    );
  }

  public applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
      })
    });
  }

}