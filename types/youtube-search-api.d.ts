// youtube-search-api.d.ts
declare module "youtube-search-api" {
  export function GetListByKeyword(
    keyword: string,
    limit: boolean
  ): Promise<any>;
}
