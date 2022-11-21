import { ref, reactive } from "vue";
import { defineStore } from "pinia";
export const useMainStore = defineStore("mainStore", () => {
  const resultados = reactive({ results: [] });
  const isLondaing = ref(false);
  const minStars = ref(1000);

  function showLoader() {
    isLondaing.value = true;
  }

  function hideLoader() {
    isLondaing.value = false;
  }

  const updateResultados = (results) => {
    resultados.results = results;
  };

  const changeStarsMin = (stars) => {
    minStars.value = stars;
  };

  return { resultados,minStars,isLondaing, updateResultados, showLoader, hideLoader,changeStarsMin };
});
