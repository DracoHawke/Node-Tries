var Store = require("../../index");
var pkg = require("../../package");

describe("Test it", function(){
    let store = null;
    let key = pkg.name;
    beforeAll(function(done){
        store = new Store({
            host: '10.13.43.1',
            user: 'jx',
            password: 'shushanfx_DJX1',
            database: 'jx',
        });
        done()
    });
    
    it("Save and get a value", async function(done){
        await store.set(key, {name: key}, 6000000);
        let obj = await store.get(key);
        expect(obj.name).toBe(key);
        done();
    })

    // it("Get a value", async function(done){
    //     let obj = await store.get(key);
    //     expect(obj.name).toBe(key);
    //     done();
    // })
    it("Remove a value", async function(done){
        await store.destroy(key);
        done();
    })
})