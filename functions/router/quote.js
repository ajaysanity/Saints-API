const express = require("express");
var admin = require("firebase-admin");
var router = express.Router();
var adminFire = admin.firestore();

router.get("/quote", async (req, res) => {
    let quotes = adminFire.collection("RawQuote")
    let key = quotes.doc().id;
    let dataObj = [];
    quotes.where(admin.firestore.FieldPath.documentId(), '>', key).limit(1).get()
        .then(snapshot => {
            if(snapshot.size > 0) {
                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                    let data = doc.data();
                    let finalData = {
                        id: doc.id,
                        ...data
                    }
                    dataObj.push({data: finalData});
                });
                return res.status(200).send(dataObj);
            }
            else {
                var quote = quotes.where(admin.firestore.FieldPath.documentId(), '<', key).limit(1).get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        console.log(doc.id, '=>', doc.data());
                        let data = doc.data();
                        let finalData ={
                            id: doc.id,
                            ...data
                        }
                        dataObj.push(finalData);
                    });
                    return res.status(200).send(dataObj);

                })
                .catch(err => {
                    return res.status(401).send('Error Something Went Wrong')
                });
            }
        }).catch(err => {
            return res.status(401).send('Error Something Went Wrong')

        });

})

router.get("/search", async(req,res) => {
    author = req.query.author
    dataObj = []
    let quoteRef = adminFire.collection('RawQuote');
    quoteRef.where('author', '>=', author).where('author', '<=', `${author}\uf8ff`)
    .get().then( snapshot => {
        if (snapshot.empty) {
            return res.status(401).send({message: 'Not Found'});
    
          }  
      
          snapshot.forEach(doc => {
              let datum ={
                  id: doc.id,
                  ...doc.data()
              }
              dataObj.push(datum)
          })
          return res.status(200).send({data: dataObj});
        })
        .catch(err => {
            return res.status(401).send('Error Something Went Wrong')
        });
    
})

module.exports = router;