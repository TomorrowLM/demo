import { reactive, computed, toRefs, watch } from "vue";


export const useData = (
) => {
  const data = reactive({
    tableData: [],
    total: 0,
    page: 1,
    limit: 10,
    search: "",
  });

  const changeData = () => {
    data.total++;
  }
  return {
    data,
    changeData
  };
};
