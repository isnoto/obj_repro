const _ = require('lodash');
const snakeCase = _.memoize(_.snakeCase);
const objection = require('objection');
const Model = objection.Model;
const config = require('./knexfile');
const Knex = require('knex');
const knex = Knex(config[process.env.NODE_ENV || 'development']);

Model.knex(knex);

class BaseModel extends Model {
  $formatDatabaseJson(json) {
    json = super.$formatDatabaseJson(json);

    return _.mapKeys(json, (value, key) => {
      return snakeCase(key);
    });
  }

  $parseDatabaseJson(json) {
    json = _.mapKeys(json, (value, key) => {
      return snakeCase(key);
    });

    return super.$parseDatabaseJson(json);
  }
}

class Physician extends BaseModel {
  static get tableName() {
    return 'physicians'
  }

  static relationMappings() {
    return {
      appointments: {
        relation: this.HasManyRelation,
        modelClass: Appointment,
        join: {
          from: 'physicians.id',
          to: 'appointments.physician_id'
        }
      },
      patients: {
        relation: this.ManyToManyRelation,
        modelClass: Patient,
        join: {
          from: 'physicians.id',
          through: {
            from: 'appointments.physician_id',
            to: 'appointments.patient_id'
          },
          to: 'patients.id'
        }
      }
    }
  }
}

class Patient extends BaseModel {
  static get tableName() {
    return 'patients'
  }

  static relationMappings() {
    return {
      appointments: {
        relation: this.HasManyRelation,
        modelClass: Appointment,
        join: {
          from: 'patients.id',
          to: 'appointments.patient_id'
        }
      },
      physicians: {
        relation: this.ManyToManyRelation,
        modelClass: Physician,
        join: {
          from: 'patients.id',
          through: {
            from: 'appointments.patient_id',
            to: 'appointments.physician_id'
          },
          to: 'physicians.id'
        }
      }
    }
  }
}

class Appointment extends BaseModel {
  static get tableName() {
    return 'appointments'
  }

  static relationMappings() {
    return {
      physician: {
        relation: this.BelongsToOneRelation,
        modelClass: Physician,
        join: {
          from: 'appointments.physician_id',
          to: 'physicians.id'
        }
      },
      patient: {
        relation: this.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'appointments.patient_id',
          to: 'patients.id'
        }
      }
    }
  }
}

Physician.query().eager('patients')
  .then(res => console.log(res));

Appointment.query().eager('[physician, patient]')
  .then(res => console.log(res));