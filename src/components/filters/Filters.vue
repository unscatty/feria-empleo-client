<template>
  <div class="col-lg-3">
    <div class="filter-secs">
      <div class="filter-heading">
        <h3>Filtros</h3>
        <a href="#" title=""
          ><button class="clear" v-on:click="clearAllFilters">
            Borrar filtros
          </button></a
        >
      </div>
      <!--filter-heading end-->
      <div class="paddy">
        <div class="filter-dd">
          <div class="filter-ttl">
            <h3>Tipo</h3>
            <a href="#" title=""
              ><button class="clear" v-on:click="clearType">Borrar</button></a
            >
          </div>
          <ul class="avail-checks" id="search-type">
            <li>
              <input
                type="radio"
                name="cc"
                id="c2"
                v-on:click="selectType('Medio tiempo')"
                v-model="filterComponent.type1Selected"
              />
              <label for="c2"> <span></span> </label>
              <small>Medio Tiempo</small>
            </li>
            <li>
              <input
                type="radio"
                name="cc"
                id="c3"
                v-on:click="selectType('Tiempo Completo')"
                v-model="filterComponent.type2Selected"
              />
              <label for="c3"> <span></span> </label>
              <small>Tiempo Completo</small>
            </li>
          </ul>
        </div>

        <div class="filter-dd">
          <div class="filter-ttl">
            <h3>Modalidad</h3>
            <a href="#" title=""
              ><button class="clear" v-on:click="crearModality">
                Borrar
              </button></a
            >
          </div>
          <ul class="avail-checks">
            <li>
              <input
                type="radio"
                name="mod"
                id="mod1"
                v-on:click="selectModality('Remoto')"
                v-model="filterComponent.modality1Selected"
              />
              <label for="mod1"> <span></span> </label>
              <small>Remoto</small>
            </li>
            <li>
              <input
                type="radio"
                name="mod"
                id="mod2"
                v-on:click="selectModality('Presencial')"
                v-model="filterComponent.modality1Selected"
              />
              <label for="mod2"> <span></span> </label>
              <small>Presencial</small>
            </li>
          </ul>
        </div>

        <div class="filter-dd">
          <div class="filter-ttl">
            <h3>Experiencia</h3>
            <a href="#" title=""
              ><button class="clear" v-on:click="clearExperience">
                Borrar
              </button></a
            >
          </div>
          <form class="job-tp">
            <select v-on:change="selectExperience($event)" v-model="filterComponent.experience">
              <option disabled>Selecciona una opción</option>
              <option value="none">Sin experiencia</option>
              <option value="1y">1 año</option>
              <option value="2y">2 años</option>
              <option value="3yy">3 años en adelante</option>
            </select>
            <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
          </form>
        </div>

        <div class="filter-dd">
          <div class="filter-ttl">
            <h3>Empresa</h3>
            <a href="#" title="">
              <button class="clear" v-on:click="clearEmployerId">
                Borrar
              </button></a
            >
          </div>
          <form class="job-tp">
            <select v-on:change="selectCompany($event)" v-model="filterComponent.employerId">
              <option disabled>Selecciona una opción</option>
              <option
                v-for="employer in filterComponent.employers"
                :key="employer.id"
                :value="employer.id"
                >{{ employer.name }}</option
              >
            </select>
            <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
          </form>
        </div>
      </div>
    </div>
    <!--filter-secs end-->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { FiltersComponent } from "./filters.component";
@Component
export default class Filters extends Vue {
    private filterComponent = new FiltersComponent();

    public selectType(type: string) { this.filterComponent.selectType(this, type); }

    public clearType() { this.filterComponent.clearType(this) }

    public selectModality(modality: string) { this.filterComponent.selectModality(this, modality) }

    public crearModality() { this.filterComponent.clearModality(this) }

    public selectExperience(experience: any) { this.filterComponent.selectExperience(this, experience) }

    public clearExperience() { this.filterComponent.clearExperience(this) }

    public selectCompany(company: any) { this.filterComponent.selectCompany(this, company) }

    public clearEmployerId() { this.filterComponent.clearCompany(this) }

    public clearAllFilters() { this.filterComponent.clearAllFilters(this) } 
}

</script>

<style>
.clear {
  border: none;
  background-color: white;
  font-size: 14px;
  color: #666666;
}
</style>
