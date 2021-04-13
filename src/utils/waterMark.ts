/**
 * 添加水印功能
 */
export class WaterMark {
    /**
     * 加载水印
     */
    public static loadWatermark(msg: string) {
        let id = this.setWatermark(msg)
        setInterval(() => {
            if (document.getElementById(id) === null) {
                id = this.setWatermark(msg)
            }
        }, 500)
        window.onresize = () => {
            this.setWatermark(msg)
        }
    }

    /**
     * 设置水印
     */
    public static setWatermark = (str: any) => {
        let id = 'id_watermark';

        if (document.getElementById(id) !== null) {
            document.body.removeChild(<any>document.getElementById(id));
        }

        let can = document.createElement('canvas');
        can.width = 300;
        can.height = 200;

        let cans: any = can.getContext('2d');
        //cans.rotate(-45 * Math.PI / 180);
        cans.font = '14px Vedana';
        cans.fillStyle = 'rgba(200, 200, 200, 0.50)';
        cans.textAlign = 'left';
        //cans.textBaseline = 'Middle';
        //cans.fillText(str, can.width / 16, can.height / 2);
        WaterMark.draw_long_text(str, cans, 0, can.height / 16);

        let div = document.createElement('div');
        div.id = id;
        div.style.pointerEvents = 'none';
        div.style.top = '-500px';
        div.style.left = '-100px';
        div.style.position = 'fixed';
        div.style.zIndex = "999999999999";
        div.style.width = document.documentElement.clientWidth - 10 + 'px';
        div.style.height = document.documentElement.clientHeight * 2 - 10 + 'px';
        div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat';
        div.style.transform = "rotate(-45deg)";
        document.body.appendChild(div);
        return id
    };

    /**
     * 内容自动换行
     * @param longtext 
     * @param cxt 
     * @param begin_width 
     * @param begin_height 
     */
    public static draw_long_text(longtext: any, cxt: any, begin_width: any, begin_height: any) {
        var text = "";
        var count = 0;
        var begin_width = begin_width;
        var begin_height = begin_height;
        var stringLenght = longtext.length;
        var newtext = longtext.split("");
        var context = cxt;
        context.clearRect(0, 0, 100, 100);
        context.textAlign = 'left';

        for (let i = 0; i <= stringLenght; i++) {

            if (count == 18) {//一行显示18个字符
                context.fillText(text, begin_width, begin_height);
                begin_height = begin_height + 25;
                text = "";
                count = 0;
            }
            if (i == stringLenght) {
                context.fillText(text, begin_width, begin_height);
            }
            var text = text + newtext[0];
            count++;
            newtext.shift();
        }
    }
}
