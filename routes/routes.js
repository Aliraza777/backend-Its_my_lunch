import express from 'express';
import mysql from 'mysql';
const router = express.Router();

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test-db' 
});

// fetch data from dishes
router.get('/featured', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).send(err);
        } else {
            connection.query('SELECT * FROM featuredDishes', (err, results) => {
                connection.release();
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.send(results);
                }
            });
        }
    });
});


// get dish by id
router.get('/featured/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).send(err);
        } else {
            // if id is not a number, return error
            if (isNaN(req.params.id)) {
                res.status(400).send('Invalid id');
            }
            // if id is a number, continue
            else {
            connection.query('SELECT * FROM featuredDishes WHERE id = ?', [req.params.id], (err, results) => {
                connection.release();
                if (err) {
                    res.status(500).send(err);
                } else {
                    if (results.length === 0) {
                        res.status(404).send('Dish not found');
                    }
                    else {
                        res.send(results);
                        }
                    }
                });
            }
        }
    });
});



// fetch data from dishes
router.get('/', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).send(err);
        } else {
            connection.query('SELECT * FROM dishes', (err, results) => {
                connection.release();
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.send(results);
                }
            });
        }
    });
});


// get dish by id
router.get('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).send(err);
        } else {
            // if id is not a number, return error
            if (isNaN(req.params.id)) {
                res.status(400).send('Invalid id');
            }
            // if id is a number, continue
            else {
            connection.query('SELECT * FROM dishes WHERE id = ?', [req.params.id], (err, results) => {
                connection.release();
                if (err) {
                    res.status(500).send(err);
                } else {
                    if (results.length === 0) {
                        res.status(404).send('Dish not found');
                    }
                    else {
                        res.send(results);
                        }
                    }
                });
            }
        }
    });
});

// create dish
router.post('/create', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).send(err);
        } else { 
            const {name , img , week , day} = req.body;
            console.log(name, img);
            // if all fields are not filled, return error
            if (!name || !img || !week || !day) {
                res.status(400).send('Please fill all fields');
            } 
            // if all fields are filled, continue
            else {
                // if name img week day are not strings, return error
                if (typeof name !== 'string' || typeof img !== 'string' || typeof week !== 'string' || typeof day !== 'string') {
                    res.status(400).send('Invalid data type');
                }
                // if name img week day are strings, continue
                else {
                    //if same data is already in database, return error
                    connection.query('SELECT * FROM dishes WHERE name = ? AND img = ? AND week = ? AND day = ?', [name, img, week, day], (err, results) => {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            if (results.length > 0) {
                                res.status(400).send('Dish already exists');
                            }
                            // if same data is not in database, continue
                            else {
                                connection.query('INSERT INTO dishes (name, img, week, day) VALUES (?, ?, ?, ?)', [name, img, week, day], (err, results) => {
                                    connection.release();
                                    if (err) {
                                        res.status(500).send(err);
                                    } else {
                                        res.send(`Added dish with name ${name} and image ${img}`);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });
});

                
// delete dish
router.delete('/delete/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).send(err);
        } else {
            // if id is not a number, return error
            if (isNaN(req.params.id)) {
                res.status(400).send('Invalid id');
            }
            // if id is a number, continue
            else {
                
            connection.query('DELETE FROM dishes WHERE id = ?', [req.params.id], (err, results) => {
                connection.release();
                if (err) {
                    res.status(500).send(err);
                } else {
                    // if no dish with id, return error
                    if (results.affectedRows === 0) {
                        res.status(404).send('Dish not found');
                    }
                    // if dish with id is found, continue
                    else {
                    res.send(`Deleted dish with id ${req.params.id}`);
                }
            }
            });
            }
        }
    });
});

// update a dish
router.put('/edit/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).send(err);
        } else {
            // if id is not a number, return error
            if (isNaN(req.params.id)) {
                res.status(400).send('Invalid id');
            }
            // if id is a number, continue
            else {
            // if name img week day are not strings, return error
            if (typeof req.body.name !== 'string' || typeof req.body.img !== 'string' || typeof req.body.week !== 'string' || typeof req.body.day !== 'string') {
                res.status(400).send('Invalid data type');
            }
            // if name img week day are strings, continue
            else {
                // if same data is already in database, return error
                connection.query('SELECT * FROM dishes WHERE name = ? AND img = ? AND week = ? AND day = ?', [req.body.name, req.body.img, req.body.week, req.body.day], (err, results) => {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        if (results.length > 0) {
                            res.status(400).send('Dish already exists');
                        }
                        // if same data is not in database, continue
                        else {
                            connection.query('UPDATE dishes SET name = ?, img = ?, week = ?, day = ? WHERE id = ?', [req.body.name, req.body.img, req.body.week, req.body.day, req.params.id], (err, results) => {
                                connection.release();
                                if (err) {
                                    res.status(500).send(err);
                                } else {
                                    // if no dish with id, return error
                                    if (results.affectedRows === 0) {
                                        res.status(404).send('Dish not found');
                                    }
                                    // if dish with id is found, continue
                                    else {
                                    res.send(`Updated dish with id ${req.params.id}`);
                                }
                            }
                            });
                        }
                    }
                });
            }
            }
        }
    });
}
);



export default router;