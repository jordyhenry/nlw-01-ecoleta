# NLW 01 - (E-Coleta)
Ecoleta is a project developed during the `Next Level Week` from `RocketSeat` using the JS stack (**nodeJS**, **React** and **React Native**) that makes easier for people to find waste disposal sites.

On the web application Waste disposal sites can register themselves and select specific types of waste they collect.

And on the mobile application, users can look for nearby sites on the map, filtered by city and waste types (like Lamps, Batteries, Paper etc).

<p align="center">
	<img src="./ecoleta-demo.gif" alt="ecoleta demo" width="80%"/>
</p>

## how to use

navigate to `server` folder and run `npm run dev`  
navigate to `web` folder and run `npm start`  
navigate to `mobile` folder and run `npm start`

## extra-mile (Stuff that I implemented beyond the app initial scope)

### Validate items in the server
Added some validations to server route for `filtered_points`, allowing the item filters to be empty, and in this case filling the filter on the server side with all the options from `Items` available in database (This was intented for the mobile optmization described below)

### Use group_concat to return
Discovered and used `group_concat` command from SQL to concatenate multiple rows result in a single value as string.  
Example `SELECT group_concat(id) AS items_ids FROM items` returns a single value `items_ids='1, 2, 3, 4, 5'`  

### Implement [RNPicker](https://www.npmjs.com/package/react-native-picker-select)
Changed the mobile application home page `Estado` and `Cidade` InputTexts to `<RNPicker />` component, and learned how to deal with his custom properties and methods 

### Relocate map on the loading
On loading the `Points Search` screen the map was center based on the user location, but if the user is in one city, and searching for Collecting Points in another city, the map should be centered in the target city.
As so, now the app check if the user city of interest has at least one collecting point,  if it is the case the map will be center in that city location, otherwise it will be center in the user location.

### Points filter optmization on the mobile App
In the first version, on the `Points Search` screen every time the user changed the items selection, a new api call was made returning all the points that match the new filter.
But I noticed that the city and state never changed, only the collected items, so the approach changed to following : On the load of `Points Search` screen the app will get from the api a list of all the points from that city,  and will cache this info, and apply the items filter locally, reducing `api` call and increasing the app responsiveness 

## noteworthy stuff that I learned
### backend
 - Use `express.static` to serve static files in the server, like uploaded images and others.
 - Use [`multer`](https://www.npmjs.com/package/multer) to manage file upload to server
 - Configure `seeds` in [`knex`](http://knexjs.org/) to have pre-filled tables in database
 - Use more actively `path.resolve()` in node
 - Use `knex.transction()` and `knex.commit()` to safelly run multiple interdependent queries in database
 
### frontend
- Use [`react-leaflet`](https://react-leaflet.js.org/) to implement maps in the application
- Deal with file upload in the frontend
- Create custom interfaces for objects and serialize api responses to meet those interfaces
- Submit form data from `React`
- Extensivelly use of `useEffect` and `useState`

### mobile
- Use `expo-google-fonts` for mobile apps
- Use `<KeyboardAvoidingView />` in `react-native` to prevent screen elements to be hidden behind keyboard
- Use `react-native-maps` to implement maps in mobile applications
- Usage of `Fragments` in `react-native`
- Use `expo-location` service and require user permission for hardware features on device
- Usage of `<ScrollView />` component

### overall
- First project using `TypeScript` ever
- Usage of `group_concat` SQL command to concat multiple rows in one single value


