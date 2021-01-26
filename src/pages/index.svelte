<script>
  import Map from '@anoram/leaflet-svelte';
  import { metatags } from '@roxi/routify';

  metatags.title = 'Comitê de Combate à Megamineração no Rio Grande do Sul (CCM/RS)';
  metatags.description = 'O CCM/RS age pela garantia de realização de audiências públicas em todas as cidades envolvidas e pressionando para que a decisão final seja do povo gaúcho, através de plebiscitos.';

  let options = {
    center: [13, 80],
    markers: [
      {
        lat: 13,
        lng: 80
      }
    ],
    mapID: "map"
  };
</script>

<style>
  .map {
    height: 80vh;
    width: auto;
  }
</style>

<h1>Projetos em fase avançada de licenciamento</h1>
<div class="map">
  <Map { options } />
</div>
