<template lang="pug">
UploaderComponent(@selected="uploadKMLChange")
UploaderComponent(@selected="uploadImageChange")
</template>

<script setup>
import { UploaderComponent } from '@syncfusion/ej2-vue-inputs';
import { CheckBoxComponent } from '@syncfusion/ej2-vue-buttons';
import { readFileSync } from 'fs';
import { kml } from '@tmcw/togeojson';
import { DOMParser } from 'xmldom';

const importedGeoData = {

};

const uploadKMLChange = (e) => {
  for (const file of e.filesData) {
    const kmlData = new DOMParser().parseFromString(readFileSync(file.rawFile.path, 'utf8'));
    const geoJson = kml(kmlData);
    for (const feature of geoJson.features) {
      let dateIndex;
      if (feature.geometry.type.toLowerCase() == 'point') {
        dateIndex = useDayjs(feature.properties.timespan.begin).format('YYYY-MM-DD');
        importedGeoData[dateIndex] = importedGeoData[dateIndex] || [];
        importedGeoData[dateIndex].push({
          begin: feature.properties.timespan.begin,
          end: feature.properties.timespan.end,
          GPSLongitude: feature.geometry.coordinates[0],
          GPSLongitudeRef: feature.geometry.coordinates[0] > 0 ? 'E' : 'W',
          GPSLatitude: feature.geometry.coordinates[1],
          GPSLatitudeRef: feature.geometry.coordinates[1] > 0 ? 'N' : 'S',
        });
      }
      if (feature.geometry.type.toLowerCase() == 'linestring') {
        const shiftSecond = parseInt(useDayjs(feature.properties.timespan.begin).diff(useDayjs(feature.properties.timespan.end), 's') / feature.geometry.coordinates.length);
        feature.geometry.coordinates.forEach((coordinates, index) => {
          dateIndex = useDayjs(feature.properties.timespan.begin).add(shiftSecond * index, 's').format('YYYY-MM-DD');
          const end = (index == feature.geometry.coordinates.length - 1) ? feature.properties.timespan.end : useDayjs(feature.properties.timespan.begin).add(shiftSecond * (index + 1), 's').toISOString();
          importedGeoData[dateIndex] = importedGeoData[dateIndex] || [];
          importedGeoData[dateIndex].push({
            begin: useDayjs(feature.properties.timespan.begin).add(shiftSecond * index, 's').toISOString(),
            end,
            GPSLongitude: coordinates[0],
            GPSLongitudeRef: coordinates[0] > 0 ? 'E' : 'W',
            GPSLatitude: coordinates[1],
            GPSLatitudeRef: coordinates[1] > 0 ? 'N' : 'S',
          });
        });

      }
      
    }
  }
  console.log(importedGeoData);
};

const uploadImageChange = (e) => {
  console.log(e);
};





</script>