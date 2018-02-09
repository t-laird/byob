![logo](public/ufo-track-logo.png?raw=true)
## Created by Julie Hawkins and Thomas Laird
### Data Scraped from nuforc.org
#### Project Built for Educational Purposes Only

## Documentation

### Get Endpoints: 
`GET /api/v1/shapes`
```json
  {"shapes":[
    
    {"id":1,  "type":"Formation","count":717},
    {"id":2,  "type":"Triangle","count":1605},
    {"id":3,  "type":"Light","count":4097},
    {"id":4,  "type":"Disk","count":684},
    ...
  ]}
```

`GET /api/v1/locations`
```json
  {"locations":[
    {
      "id":1,
      "city":"Fort Erie (Canada)",
      "state":"ON",
      "count":1
    },
    {
      "id":2,
      "city":"Roanoke",
      "state":"VA",
      "count":15
    },
    {
      "id":3,
      "city":"Sidney",
      "state":"OH",
      "count":1
    },
    ...
  ]}
```

`GET /api/v1/sightings/shape?shape={shape}`
### Parameters
| Name | Type |  Description |
| ---- | ---- | ------------ |
| Shape | String | For list of valid shapes see GET to /api/v1/shapes |
```json
  {"sightings": [
    {
      "id": 18942,
      "shape_id": 1933,
      "location_id": 635963,
      "summary": "Approximately 8:30 in the evening on a clear night a two red lights moving equal distance apart from each other moved from East to West",
      "duration": "6 minuntes",
      "reported_time": null
    },
    {
      "id": 18851,
      "shape_id": 1933,
      "location_id": 635902,
      "summary": "There were four red lights. Two lights with a space and then two more lights. They were horizontal. Flashed on for two seconds, then of",
      "duration": "30 second",
      "reported_time": null
    },
    {
      "id": 18890,
      "shape_id": 1933,
      "location_id": 635938,
      "summary": "In sky, wasn’t moving. Pulled over and got out to see it and it was gone in under 5 seconds",
      "duration": "1 minute",
      "reported_time": null
    },
    ...
  ]}
```

`GET /api/v1/sightings/location?city={city}&state={state}`

| Name | Type |  Description |
| ---- | ---- | ------------ |
| City | String | Existing (in DB) city in US or Canada|
| State | String | Existing (in DB) state in US or Canada|
```json
  {"sightings": [
    {
      "id": 19281,
      "shape_id": 1918,
      "location_id": 636249,
      "summary": "Red and white blinking lights in a downward line formation. Traveled from east to west maybe 25 miles then disappeared.",
      "duration": "4 minutes",
      "reported_time": null
    },
    {
      "id": 19285,
      "shape_id": 1929,
      "location_id": 636249,
      "summary": "My family and I first saw a circular formation of strobing red lights. We decided to stop and look and the formation changed. They star",
      "duration": "20+minutes",
      "reported_time": null
    },
    {
      "id": 19277,
      "shape_id": 1918,
      "location_id": 636249,
      "summary": "Denver: String of lights, in formation, no sound. ((anonymous report))",
      "duration": "30 minutes",
      "reported_time": null
    },
    ...
  ]}
```

`POST /api/v1/locations`

| Name | Type |  Description |
| ---- | ---- | ------------ |
| City | String | REQUIRED. The city of the location.|
| State | String | REQUIRED. The city of the location.|
| count | Integer | The amound of sightings at this location.|
| id | Integer | The id of the location.|

```json
{
}
```

`POST /api/v1/sightings`

| Name | Type |  Description |
| ---- | ---- | ------------ |
| Duration | String | The reported duration of the sighting to be added.|
| Summary | String | The reported summary of the sighting to be added.|
| reported_time | String | The reported date and time of the sighting to be added.|
| id | Integer | The id of the sighting.|
| shape_id | Integer | The id of the sighting.|
| location_id | Integer | The id of the sighting.|

```json
{
}
```
