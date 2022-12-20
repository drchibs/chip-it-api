import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { Author: 'Dennis R. Chibuike' }
})

Route.post('/login', 'AuthController.login')
Route.post('/signup', 'AuthController.register')

Route.group(()=> {
  Route.get('/users', 'UsersController.index')
  Route.get('/users/:id', 'UsersController.show')
  Route.patch('/users/:id', 'UsersController.update')
  Route.delete('/users/:id', 'UsersController.destroy')
  Route.get('/users/:id/chips', 'ChipsController.userChips')
  Route.get('/users/:id/favorites', 'ChipsController.userFavoriteChips')


  Route.post('/folders', 'FoldersController.create')
  Route.get('/folders', 'FoldersController.index')
  Route.get('/folders/:id', 'FoldersController.show')
  Route.patch('/folders/:id', 'FoldersController.update')
  Route.delete('/folders/:id', 'FoldersController.destroy')
  Route.get('/folders/:id/chips', 'FoldersController.folderChips')
  Route.patch('/folders/:folderId/chips/:chipId', 'FoldersController.addChipToFolder')
  Route.delete('/folders/:folderId/chips/:chipId', 'FoldersController.removeChipFromFolder')


  Route.post('/chips', 'ChipsController.create')
  Route.get('/chips', 'ChipsController.index')
  Route.get('/chips/:id', 'ChipsController.show')
//  Route.patch('/chips/:id', 'ChipsController.update')
  Route.delete('/chips/:id', 'ChipsController.destroy')
  Route.patch('/chips/:id/clicks', 'ChipsController.incrementClicks')
  Route.patch('/chips/:id/toggle-favorite', 'ChipsController.toggleFavorite')


}).prefix('/v1').middleware("auth")
