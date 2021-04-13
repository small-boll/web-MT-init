/**
  * 获取指定键的名称本地缓存数据
  * @param key 存储名称
  */
export const getLocalStorage = (key: any) => {
  let result = localStorage.getItem(key);
  //return !!result ? JSON.parse(result) : result;

  return !!result ? result : '';
}

/**
 * 设置指定键值对的本地缓存数据
 * @param key 键名称
 * @param value 键值
 */
export const setLocalStorage = (key: any, value: any) => localStorage.setItem(key, value);

/**
 * 删除指定键名称的本地缓存数据
 * @param key 键名称
 */
export const removeLocalStorage = (key: any) => localStorage.removeItem(key);

/**
 * 清楚所有本地缓存数据
 */
export const clearLocalStorage = () => localStorage.clear();