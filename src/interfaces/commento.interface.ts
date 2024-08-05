export type ICommentoAuth = {
  redirect: string;
};

export type ICommentoCount = {
  commentCounts: Map<string, number>;
  success: boolean;
};
