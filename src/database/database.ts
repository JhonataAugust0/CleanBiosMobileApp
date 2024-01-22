import SQLite from 'react-native-sqlite-storage';
import { Service } from "../interfaces/Service.ts";
import { Photo } from "../interfaces/Photo.ts";

SQLite.DEBUG(true);
SQLite.enablePromise(true);

class ServiceDatabase {
  db: SQLite.SQLiteDatabase | null = null;
  databaseName: string;
  databaseVersion: string;
  databaseDisplayname: string;
  databaseSize: number;

  constructor() {
    this.databaseName = 'ReactNativeSQLite.db';
    this.databaseVersion = '1.0';
    this.databaseDisplayname = 'SQLite React Native Offline Database';
    this.databaseSize = 200000;
  }

  async openDatabase(): Promise<void> {
    return new Promise<void>(resolve => {
      console.log('Checando a integridade do plugin ...');
      SQLite.echoTest()
        .then(() => {
          console.log('Integridade Ok ...');
          console.log('Abrindo Banco de Dados ...');
          SQLite.openDatabase(
            this.databaseName,
            this.databaseVersion,
            this.databaseDisplayname,
            this.databaseSize,
          ).then((DB: any) => {
            this.db = DB;
            console.log('Banco de dados Aberto');
            this.db
              .executeSql('SELECT 1 FROM service LIMIT 1')
              .then(() => {
                console.log(
                  'O banco de dados está pronto ... Executando Consulta SQL ...',
                );
              })
              .catch((error: any) => {
                console.log('Erro Recebido: ', error);
                console.log(
                  'O Banco de dados não está pronto... Criando tabela',
                );
                this.db?.transaction((tx: SQLite.SQLTransaction) => {
                  tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS Service (id INTEGER PRIMARY KEY AUTOINCREMENT, servico varchar(100), data varchar(100), foto varchar(255));',
                  );
                  tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS Photo(id INTEGER PRIMARY KEY AUTOINCREMENT, path varchar(300));',
                  );
                });
              })
              .then(() => {
                console.log('Tabela criada com Sucesso');
              })
              .catch((error: any) => {
                console.log(error);
              });
          });
          resolve();
        })
        .catch((error: any) => {
          console.log(error);
        });
    }).catch(error => {
      console.log('echoTest Falhou - plugin não funcional' + error);
    });
  }

  closeDatabase(): void {
    if (this.db) {
      console.log('Fechando Banco de Dados');
      this.db.transaction((tx: SQLite.SQLTransaction) => {
        tx.executeSql('COMMIT', [], () => {
          this.db
            ?.close()
            .then((status: any) => {
              console.log('Banco de dados Desconectado!!' + status);
            })
            .catch((error: any) => {
              console.log(error);
            });
        });
      });
    } else {
      console.log('A conexão com o banco não está aberta');
    }
  }

  inserir(item: {servico: string; data: string; foto: string}): Promise<any> {
    return new Promise(resolve => {
      if (this.db) {
        this.db.transaction((tx: SQLite.SQLTransaction) => {
          tx.executeSql(
            'INSERT INTO Service (servico, data, foto) VALUES (?, ?, ?)',
            [item.servico, item.data, item.foto],
          ).then(([tx, results]) => {
            resolve(results);
          });
        });
      } else {
        console.log('O banco de dados não está aberto');
      }
    });
  }

  inserirFoto(item: Photo): Promise<any> {
    return new Promise(resolve => {
      if (this.db) {
        this.db.transaction((tx: SQLite.SQLTransaction) => {
          tx.executeSql('INSERT INTO Photo (path) VALUES (?)', [
            item.path,
          ]).then(([tx, results]) => {
            resolve(results);
          });
        });
      } else {
        console.log('O banco de dados não está aberto');
      }
    });
  }

  async listar(): Promise<Service[]> {
    return new Promise<any[]>(resolve => {
      const lista: any[] = [];
      if (this.db) {
        this.db
          .transaction((tx: SQLite.SQLTransaction) => {
            tx.executeSql('SELECT * FROM Service', []).then(([tx, results]) => {
              console.log('Consulta completa');
              const len = results.rows.length;
              for (let i = 0; i < len; i++) {
                const row = results.rows.item(i);
                const {id, servico, data, foto} = row;
                lista.push({id, servico, data, foto});
              }
              console.log(lista);
              resolve(lista);
            });
          })
          .then(() => {
            this.closeDatabase();
          })
          .catch((err: any) => {
            console.log(err);
          });
      } else {
        console.log('O banco de dados não está aberto');
        resolve([]);
      }
    });
  }

  async listarFoto(): Promise<Photo[]> {
    return new Promise<any[]>(resolve => {
      const lista: any[] = [];
      if (this.db) {
        this.db
          .transaction((tx: SQLite.SQLTransaction) => {
            tx.executeSql('SELECT * FROM Photo', []).then(([tx, results]) => {
              console.log('Consulta completa');
              const len = results.rows.length;
              for (let i = 0; i < len; i++) {
                const row = results.rows.item(i);
                const {id, path} = row;
                lista.push({id, path});
              }
              console.log(lista);
              resolve(lista);
            });
          })
          .then(() => {
            this.closeDatabase();
          })
          .catch((err: any) => {
            console.log(err);
          });
      } else {
        console.log('O banco de dados não está aberto');
        resolve([]);
      }
    });
  }

  async remover(id: number): Promise<any> {
    return new Promise(resolve => {
      if (this.db) {
        this.db
          .transaction((tx: SQLite.SQLTransaction) => {
            tx.executeSql('DELETE FROM Service WHERE Id = ?', [id]).then();
          })
          .then(() => {
            this.closeDatabase();
          })
          .catch((err: any) => {
            console.log(err);
          });
      } else {
        console.log('O banco de dados não está aberto');
      }
    });
  }
}

export default ServiceDatabase;
