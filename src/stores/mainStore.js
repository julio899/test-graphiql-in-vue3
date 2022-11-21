import { ref, reactive } from "vue";
import { defineStore } from "pinia";
export const useMainStore = defineStore("mainStore", () => {
  const resultados = reactive({ results: [] });
  const isLondaing = ref(false);

  function showLoader() {
    isLondaing.value = true;
  }

  function hideLoader() {
    isLondaing.value = false;
  }

  const updateResultados = (results) => {
    resultados.results = results;
  };

  return { resultados, updateResultados, isLondaing, showLoader, hideLoader };
});
