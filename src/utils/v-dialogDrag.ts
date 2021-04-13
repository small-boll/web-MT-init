import Vue from 'vue'

// v-dialogDrag: elementui中dialog弹窗拖拽属性
Vue.directive('dialogDrag', {
    bind(el, binding, vnode, oldVnode) {
      const dialogHeaderEl: any = el.querySelector('.header-title');
      const dragDom: any = el.querySelector('.realtimeVideoGridBack-template');


      //dialogHeaderEl.style.cursor = 'move';
      dialogHeaderEl.style.cssText += ';cursor:move;'
      dragDom.style.cssText += ';top:0px;'
  
      dialogHeaderEl.onmousedown = (e: any) => {

        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - dialogHeaderEl.offsetLeft;
        const disY = e.clientY - dialogHeaderEl.offsetTop;

        
  
        const screenWidth = document.body.clientWidth; // body当前宽度
        const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取) 
  
        const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
        const dragDomheight = dragDom.offsetHeight; // 对话框高度
  
        const minDragDomLeft = dragDom.offsetLeft;   
        const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;
  
        const minDragDomTop = dragDom.offsetTop;
        const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;
        
  
  
        // 获取到的值带px 正则匹配替换
        let styL = dragDom.style.left;
        let styT = dragDom.style.top;

        console.log('styL',styL);
        console.log('styT',styT);
  
  
        // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
        if (styL.includes('%')) {
          styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100);
          styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100);
        } else {
          styL = +styL.replace(/\px/g, '');
          styT = +styT.replace(/\px/g, '');
        };
  
  
        document.onmousemove = function (e) {
          // 通过事件委托，计算移动的距离 
          let left = e.clientX - disX;
          let top = e.clientY - disY;
  
  
          // 边界处理
          if (-(left) > minDragDomLeft) {
            left = -(minDragDomLeft);
          } else if (left > maxDragDomLeft) {
            left = maxDragDomLeft;
          }
  
          if (-(top) > minDragDomTop) {
            top = -(minDragDomTop);
          } else if (top > maxDragDomTop) {
            top = maxDragDomTop;
          }
  
  
          // 移动当前元素 
          dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
        };
  
        document.onmouseup = function (e) {
          document.onmousemove = null;
          document.onmouseup = null;
          
        };
      }
    }
  });
  
  // v-divDrag: div弹窗拖拽属性
  Vue.directive('divDrag', {
    bind(el, binding, vnode, oldVnode) {
      const dialogHeaderEl: any = el.querySelector('.el-div__header');
      const dragDom: any = el.querySelector('.el-div');
      //获取全局隐藏层
      const globalHideDiv:any = document.getElementById("dragHideDiv");
      //dialogHeaderEl.style.cursor = 'move';
      dialogHeaderEl.style.cssText += ';cursor:move;'
      dragDom.style.cssText += ';top:0px;'
  
      dialogHeaderEl.onmousedown = (e: any) => {
        globalHideDiv.style.visibility = "visible";
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - dialogHeaderEl.offsetLeft;
        const disY = e.clientY - dialogHeaderEl.offsetTop;
  
        const screenWidth = document.body.clientWidth; // body当前宽度
        const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取) 
  
        const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
        const dragDomheight = dragDom.offsetHeight; // 对话框高度
  
        const minDragDomLeft = dragDom.offsetLeft;
        const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;
  
        const minDragDomTop = dragDom.offsetTop;
        const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;
  
  
        // 获取到的值带px 正则匹配替换
        let styL = dragDom.style.left;
        let styT = dragDom.style.top;
  
  
        // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
        if (styL.includes('%')) {
          styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100);
          styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100);
        } else {
          styL = +styL.replace(/\px/g, '');
          styT = +styT.replace(/\px/g, '');
        };
  
        window.document.onmousemove = function (e:any) {
          // 通过事件委托，计算移动的距离 
          let left = e.clientX - disX;
          let top = e.clientY - disY;
  

          // 移动当前元素 
          dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;     
        };

  
        window.document.onmouseup = function (e:any) {
          document.onmousemove = null;
          document.onmouseup = null;
          globalHideDiv.style.visibility = "hidden";
        };

        return false;
      }
    }
  });

  // v-dialogDrag: elementui中dialog弹窗拖拽属性
Vue.directive('CommonDrag', {
  bind(el, binding, vnode, oldVnode) {
    const dialogHeaderEl: any = el.querySelector('.dragPanel-header');
    const dragDom: any = el.querySelector('.dragPanel-dom');


    //dialogHeaderEl.style.cursor = 'move';
    dialogHeaderEl.style.cssText += ';cursor:move;'
    // dragDom.style.cssText += ';top:0px;'

    dialogHeaderEl.onmousedown = (e: any) => {

      //对话框距离浏览器左边和上边的距离
      const dragDomLeft = dragDom.offsetLeft;
      const dragDomTop = dragDom.offsetTop;

      const eOffsetLeft = e.clientX - dragDomLeft;
      const eOffsetTop = e.clientY - dragDomTop;
      

      const screenWidth = document.body.clientWidth; // body当前宽度
      const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取) 

      const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
      const dragDomheight = dragDom.offsetHeight; // 对话框高度

      const minDragDomLeft = 0;   
      const maxDragDomLeft = screenWidth - dragDomWidth;

      const minDragDomTop = 0;
      const maxDragDomTop = screenHeight - dragDomheight;


      


      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离 
        let left = e.clientX - eOffsetLeft;
        let top = e.clientY - eOffsetTop;



        
        // 边界处理
        if(left< minDragDomLeft){
          left=minDragDomLeft;
        }
        if(left> maxDragDomLeft){
          left=maxDragDomLeft;
        }
        
        if(top< minDragDomTop ){
          top = minDragDomTop;
        }
        if(top > maxDragDomTop){
          top = maxDragDomTop;
        }

        // 移动当前元素 
        dragDom.style.cssText += `;left:${left }px;top:${top }px;`;
      };

      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
        
      };
    }
  }
});