export default class IconList {
  public getList() {
    const req = require.context('@/assets/icons/svg', false, /\.svg$/);
    const requireAll = requireContext => requireContext.keys()
    const re = /\.\/(.*)\.svg/
    const icons = requireAll(req).map(i => {
      return i.match(re)[1]
    })
    return icons;
  }


}
