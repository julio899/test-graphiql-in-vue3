<template>
  <HeaderView/>  
  <div class="container pt-4">

    <div class="row">
      <div class="col-md-10">
        <label class="header-search-wrapper">
          <input 
              id="input-topic"
              type="text"
              v-model="texto" 
              class="input-git" 
              placeholder="Ingrese el Topico a buscar..."
              v-on:input="searchData">

              <label for="input-stars">⭐</label>
              <input 
                id="input-stars" 
                class="input-git" 
                type="number" 
                min="1" 
                v-on:input="updateMinStars" 
                v-model="minStars"
                placeholder="Stars Min" >

                <div class="caja">
                  <select v-model="top" @change="searchData">
                    <option value="10">TOP 10</option>
                    <option value="50">TOP 50</option>
                    <option value="100">TOP 100</option>
                  </select>
                </div>

        </label>
      </div>

      <div class="col-md-2">
        <button class="btn btn-info btn-reset" @click="reset">Reset</button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12 container-table">
        <h5 class="title-results">Resultados</h5>
        <table class="table">
          <thead class="text-primary">
            <tr>
              <th>Name</th>
              <th>⭐ Stars</th>
              <th>Fork Count</th>
              <th>Topics</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in store.resultados.results">
              <td><a :href="r.repo.url" target="_blank">{{r.repo.name}}</a></td>
              <td class="text-center">{{formatAmount(r.repo.stargazerCount)}}</td>
              <td class="text-center">{{formatAmount(r.repo.forkCount)}}</td>
              <td>{{r.repo.repositoryTopics.nodes.map(t => t.topic.name )}}</td>
              <!-- <td class="text-primary"></td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
  </div>
  <Loader v-if="store.isLondaing"/>
</template>

<style scoped></style>
<script>
import { ref } from "vue";
import { debounce } from "vue-debounce";
import { useMainStore } from "./stores/mainStore";
import Loader from "./components/Loader.vue";
import HeaderView from "./views/HeaderView.vue";
import Busquedas from "./composables/Busquedas"; // en este composable implementamos las funciones y logica dedicada solo a busquedas
const { githubGraphiQL } = Busquedas(); // extraemos solo la funcion que necesitamos

export default {
  name: "App",
  components:{
    HeaderView,
    Loader
  },
  setup() {
    const texto = ref("");
    const store = useMainStore();
    const minStars = ref(parseInt(store.minStars));
    const top = ref(10);// por defecto el top 10

    const reset = ()=>{ texto.value=''; store.updateResultados([]); };

    // mientras escribe que espere a que termite
    // y cuando deje de escribir y pause al menos 1 segundo
    // en ese momento allí si que lance la petición
    // y no este lanzando peticiones por cada letra
    const searchData = debounce(async () => {
      const txt = texto.value.toString().trim();
      
      // si esta vacio no se emite el request y retornamos
      if (txt == "") {
        reset();
        return;
      }

      store.showLoader();

      // llamamos al composable donde se encuentra la loguca del request
      const response = await githubGraphiQL({ txt, stars:parseInt(minStars.value), top:top.value});

      // actualizamos el store de pinia con la actualizacion de data
      // para que se encuentren disponible desde cualquier vista
      store.updateResultados(response);

      store.hideLoader();
    }, 1000);

    // formateamos la cantidad a miles para que sea expresado como en Github (100k, 50k) etc
    const formatAmount = (amount)=>{
      const a = parseFloat(parseFloat(parseFloat(amount).toFixed(1)) /1000);
      return (a > 1 ) ? a.toFixed(1)+'k': amount;
    };

    const updateMinStars = debounce((v) => {
      store.changeStarsMin( parseInt(minStars.value) );
      searchData();
    },1000)

    return { texto, searchData, store, minStars, updateMinStars, top, formatAmount,reset };
  },
};
</script>

<style scoped>
  h5.title-results{
    color: #fff;
    font-weight: 100;
    text-transform: uppercase;
    padding-top: 0.5em;
  }
  .input-git{
    display: table-cell;
    /* width: 100%; */
    height: 40px;
    padding-top: 0;
    padding-bottom: 0;
    font-size: inherit;
    color: inherit;
    background: none;
    border-radius: 7px;
    border: 1px;
    border-style: inset;
    border-color: rgb(133, 133, 133);
    padding-left: 1em;
    margin: auto 10px;
  }
  #input-stars{
    width: 100px;
    text-align: center;
  }
  .container-input-git{
    display: table;
    width: 100%;
    max-width: 100%;
    padding: 0;
    font-size: inherit;
    font-weight: 400;
    vertical-align: middle;
    background-color: var(--color-header-search-bg);
    border: 1px solid var(--color-header-search-border);
    box-shadow: none;
  }
  .header-search-wrapper,.btn-reset{
    width: 100%;
  }
  .container-table{
    height: 70vh;
    overflow: auto;
    overflow-x: scroll;
  }
/* estilos para tabla */
table thead tr{
    background-color: #161b22;
    border: 2px solid #30363d;
}
.table td{
    white-space: nowrap;
    border-color: rgb(47 53 60 / 33%);
    border-style: dotted;
}

.caja {
    border: 1px solid #f0f2f533;
    overflow: hidden;
    width: 230px;
    position: relative;
    display: inline-flex;
    background-color: #d9d9d900;
    border-radius: 5px;
}
select {
   background: transparent;
   border: none;
   font-size: 14px;
   height: 35px;
   padding: 5px;
   width: 250px;    
   color: inherit;
}
select:focus{ outline: none;}

.caja::after{
	content:"\025be";
	display:table-cell;
	padding-top:7px;
	text-align:center;
	width:30px;
	height:35px;
	background-color:#d9d9d9;
	position:absolute;
	top:0;
	right:0px;	
	pointer-events: none;
}

  /*Estilos del scroll para el contenedor de la tabla */
  /* width */
  .container-table::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

/* Track */
.container-table::-webkit-scrollbar-track {
  background: #0d1117;
}

.container-table::-webkit-scrollbar-thumb:horizontal{
    background: #888;
    border-radius: 5px;
    /* scroll Horizontal */
}

/* Handle */
.container-table::-webkit-scrollbar-thumb {
  background: #888;
  
}

/* Handle on hover */
.container-table::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>