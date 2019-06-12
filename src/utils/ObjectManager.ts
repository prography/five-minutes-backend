export class ObjectManager {
  static deleteValuesByKeys<T>(deletable: T, keys: string[]) {
    return ObjectManager.iterateChildren(deletable, (key, _, obj) => {
      if (keys.includes(key)) {
        delete obj[key];
      }
    });
  }

  static filterShowingKeys<T>(obj: T, keys: string[]) {
    return ObjectManager.iterateChildren(obj, (key, _, obj) => {
      if (!keys.includes(key)) {
        delete obj[key];
      }
    });
  }

  private static iterateChildren<T extends any>(obj: T, callback: (key: any, value: any, child: any) => any) {
    // 자식을 순회하며 key에 맞춰서 확인한다.
    if (Array.isArray(obj)) {
      return obj.map((o: T) => ObjectManager.iterateChildren(o, callback));
    }
    return Object.keys(obj).reduce(
      (acc: any, key: string) => {
        const isObject = typeof obj[key] === 'object';
        // undefined는 삭제
        if (obj[key] === undefined || obj[key] === null) {
          delete obj[key];
          return acc;
        }
        if (
          typeof obj[key] === 'number' ||
          typeof obj[key] === 'string' ||
          obj[key] instanceof Date ||
          typeof obj[key] === 'boolean'
        ) { // 데이터 필드인 경우
          callback(key, obj[key], obj);
          acc[key] = obj[key];
        } else if (isObject && Array.isArray(obj[key])) { // 자식이 배열인 경우
          acc[key] = obj[key].map((child: any) => ObjectManager.iterateChildren(child, callback)) || [];
        } else if (isObject) { // object가 자식인 경우
          acc[key] = ObjectManager.iterateChildren(obj[key], callback);
        }
        return acc;
      },
      {},
    );
  }
}
