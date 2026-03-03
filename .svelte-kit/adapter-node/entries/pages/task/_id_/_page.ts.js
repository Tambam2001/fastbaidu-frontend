const ssr = false;
const load = async ({ params }) => {
  return { taskId: params.id };
};
export {
  load,
  ssr
};
