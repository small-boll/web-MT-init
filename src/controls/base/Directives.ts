import Vue from 'vue'

Vue.directive('watermark', (el, binding) => {
    function addWaterMarker(str: string, parentNode: any, font: any, textColor: any, density: number = 3) {// 水印文字，父元素，字体，文字颜色,密度

        let id = "1.23452384164.123412416.";
        let water = document.getElementById(id);
        if (!!water) {
            document.body.removeChild(water);
        }
        let can = document.createElement('canvas');
        parentNode.appendChild(can);
        can.width = 100 * density;
        can.height = 100 * density;
        can.style.display = 'none';
        let cans: any = can.getContext('2d');
        cans.rotate(-20 * Math.PI / 180);
        cans.font = font || "12px Microsoft JhengHei";
        cans.fillStyle = textColor || "rgba(180, 180, 180, 0.3)";
        cans.textAlign = 'left';
        cans.textBaseline = 'Middle';
        cans.fillText(str, can.width / 3, can.height/ 2+50);
        //parentNode.style.backgroundImage = "url(" + can.toDataURL("image/png") + ")";

        let div = document.createElement('div');
        div.id = id;
        div.style.pointerEvents = 'none';
        div.style.top = '30px';
        div.style.left = '0px';
        div.style.position = 'fixed';
        div.style.zIndex = '1';
        div.style.width = document.documentElement.clientWidth + 'px';
        div.style.height = document.documentElement.clientHeight + 'px';
        div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat';
        document.body.appendChild(div);

    }
    addWaterMarker(binding.value.text, el, binding.value.font, binding.value.textColor)
})