const rocksDB = require('rocksdb');
const path = require('path');

class Database {
    constructor(dbName){
        this.dbPath = path.resolve(__dirname, '../../db_data', dbName);
        this.db = null;
        this.open((err) => {
            if(err){
                console.error('Erro ao abrir o banco de dados:', err);
            }
        });
    }

    open(callback) {
        this.db = new rocksDB(this.dbPath);
        this.db.open(callback);
    }

    close(callback) {
        if(this.db){
            this.db.close(callback);
        }
    }

    readAllData(callback) {
        if(!this.db){
            return callback(new Error('O banco de dados não está aberto'));
        }

        const data = [];

        const iterator = this.db.iterator({});

        const loop = () => {
            iterator.next((err, key, value) => {
                if(err) {
                    iterator.end(() => {
                        callback(err);
                    });
                    return;
                }

                if(!key && !value) {
                    iterator.end(() => {
                        callback(null, data);
                    });
                    return;
                }

                data.push({ key: key.toString(), value: value.toString() });
                loop();
            });
        };

        loop();
    }

    put(key, value, callback){
        if (!this.db){
            return callback(new Error('O banco de dados não está aberto'));
        }
        this.db.put(key, value, callback);
    }

    get(key, callback) {
        if(!this.db){
            return callback(new Error('O banco de dados não está aberto'));
        }
        this.db.get(key, callback);
    }

    del(key, callback) {
        if(!this.db){
            return callback(new Error('O banco de dados não está aberto'));
        }
        this.db.del(key, callback);
    }
}

module.exports = Database;