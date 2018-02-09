![logo](public/ufo-track-logo.png?raw=true)
## Created by Julie Hawkins and Thomas Laird
### Data Scraped from nuforc.org
#### Project Built for Educational Purposes Only

API Can Be found [here](https://ufo-tracker-thawk.herokuapp.com/)!

![scheam](UFO-Schema.png?raw=true)

## Documentation:

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

```json
{
  "status": "Successfully added location (#162836)."
}
```
`POST /api/v1/sightings`

| Name | Type |  Description |
| ---- | ---- | ------------ |
| Duration | String | REQUIRED. The reported duration of the sighting to be added.|
| Summary | String | REQUIRED. The reported summary of the sighting to be added.|
| reported_time | String | REQUIRED. The reported date and time of the sighting to be added.|

```json
{
  "status": "Successfully added sighting (#18059).
}
```

`PATCH /api/v1/sightings/:id/summary`
### Parameters
| Name | Type |  Description |
| ---- | ---- | ------------ |
| id | integer | Integer corresponding to the sighting you wish to update |
| summary | text | sent in the body of the request |

```json
{
  "status": "Successfully updated summary of sighting #1234 to 'New Summary'"
}
```

`PATCH /api/v1/sightings/:id/duration`
### Parameters
| Name | Type |  Description |
| ---- | ---- | ------------ |
| id | integer | Integer corresponding to the sighting you wish to update |
| duration | text | sent in the body of the request |

```json
{
  "status": "Success updating duration: #1234"
}
```

`DELETE '/api/v1/sightings/:id`
### Parameters
| Name | Type |  Description |
| ---- | ---- | ------------ |
| id | integer | Integer corresponding to the sighting you wish to delete |

```json
{
  "status": "Success deleting sighting 1234: 1234"
}
```

`DELETE '/api/v1/sightings?city={city}&state={state}`
### Parameters
| Name | Type |  Description |
| ---- | ---- | ------------ |
| city | text | Name of the city you want to delete |
| state | text | Name of the state you want to delete |

(Both arguments are required, only one City in one state can be deleted at a time)

```json
{
  "status": "Successfully deleted all locations with id #1234."
}
```



