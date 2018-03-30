const chai = require('chai');
const chaiHttp = require('chai-http');
const {app,runServer,closeServer} = require('../server');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Recipes',function()
{

  before(function()
   {
    return runServer();
  });

  after(function()
  {
    return closeServer();
  });

  //test-strategy
  it('Should return all recipes on GET',function()
  {

     return chai.request(app).get('/recipes').then(function(res){
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');

      expect(res.body.length).to.be.at.least(1);

      const expectedKeys = ['id','name','ingredients'];
      res.body.forEach(function(item)
      {
        expect(item).to.be.a('object');
        expect(item).to.include.keys(expectedKeys);
      });
   });
  });

  it('Create new recipe on POST',function()
     {
       const newRecipe = {
                            name : 'tea',
                            ingredients:['hot-water','tea-powder']
                          };
       return chai.request(app).post('/recipes').send(newRecipe).then(function(res)
         {
           expect(res).to.have.status(201);
           expect(res).to.be.json;
           expect(res.body).to.be.a('object');
           expect(res.body).to.include.keys('id','name','ingredients');
           expect(res.body.ingredients).to.be.a('array');
           expect(res.body.name).to.be.equal(newRecipe.name);
           expect(res.body.ingredients).include.members(newRecipe.ingredients);

         });
     });

    it('should update recipes on PUT',function(){

      const updateRecipe = {
        name : 'foo',
        ingredients : ['bizz','bang']
      };

      return chai.request(app).get('/recipe').then(function(res)
      {
         updateRecipe.id = res.body[0].id  ;

         return chai.request(app).put(`/recipes/${updateRecipe.id}`).send(updateRecipe);
      }).then(function(res){
         expect(res).to.have.status(204);
      });
    }) ;

    it('should remove recipe on DELETE',function()
    {
       return chai.request(app).get('/recipe').then(function(res)
       {
          return chai.request(app).delete('/recipe/res.body[0].id').then(function(res)
          {
            expect(res).to.have.status(204);
          })  ;

        });

    });


}); //describe
