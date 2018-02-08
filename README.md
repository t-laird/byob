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

`GET /api/v1/sightings?shape={shape}`
### Parameters
| Name | Type |  Description |
| ---- | ---- | ------------ |
| Shape | String | For list of valid shapes see GET to /api/v1/shapes |
```json
  {}
```

`GET /api/v1/sightings?city={city}&state={state}`

| Name | Type |  Description |
| ---- | ---- | ------------ |
| City | String | Existing (in DB) city in US or Canada|
| State | String | Existing (in DB) state in US or Canada|
```json
  {}
```
