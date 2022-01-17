const { db } = require("../../cnn");

module.exports = resolvers = {
  Query: {
    async getPacientes(root, { id }) {
      try {
        let pacientes = {};
        if (id == undefined) {
          pacientes = await db.any(`select * from paciente order by pac_id`);
        } else {
          pacientes = await db.any(
            `select * from paciente where pac_id=$1 order by pac_id`,
            [id]
          );
        }
        for (const key in pacientes) {
          if (Object.hasOwnProperty.call(pacientes, key)) {
            const paciente = pacientes[key];
            const citas = await db.any(
              `select * from cita_medica where pac_id=$1`,
              [paciente.pac_id]
            );
            paciente.citas = citas;
            for (const key in citas) {
              if (Object.hasOwnProperty.call(citas, key)) {
                const cita = citas[key];
                cita.medico = await db.one(
                  `select m.* from medico m inner join cita_medica c using(med_id) where c.cit_med_id=$1`,
                  [cita.cit_med_id]
                );
                cita.medico.especialidad = await db.one(
                  `select e.* from especialidad e inner join medico m using(esp_id) where m.med_id=$1`,
                  [cita.medico.med_id]
                );
              }
            }
          }
        }
        return pacientes;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async getMedicos(root, { id }) {
      try {
        let medicos = {};
        if (id == undefined) {
          medicos = await db.any(`select * from medico order by med_id`);
        } else {
          medicos = await db.any(`select * from medico where med_id=$1`, [id]);
        }
        for (const key in medicos) {
          if (Object.hasOwnProperty.call(medicos, key)) {
            const medico = medicos[key];
            medico.especialidad = await db.one(
              `select e.* from especialidad e inner join medico m using(esp_id) where m.med_id=$1`,
              [medico.med_id]
            );
            const citas = await db.any(
              `select * from cita_medica where med_id=$1`,
              [medico.med_id]
            );
            medico.citas = citas;
            for (const key in citas) {
              if (Object.hasOwnProperty.call(citas, key)) {
                const cita = citas[key];
                cita.paciente = await db.one(
                  `select p.* from paciente p inner join cita_medica c using(pac_id) where c.cit_med_id=$1`,
                  [cita.cit_med_id]
                );
              }
            }
          }
        }
        return medicos;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async getEspecialidades(root, { id }) {
      try {
        let especialidades = {};
        if (id == undefined) {
          especialidades = await db.any(
            `select * from especialidad order by esp_id`
          );
        } else {
          especialidades = await db.any(
            `select * from especialidad where esp_id=$1`,
            [id]
          );
        }
        for (const key in especialidades) {
          if (Object.hasOwnProperty.call(especialidades, key)) {
            const especialidad = especialidades[key];
            const medicos = await db.any(
              `select m.* from medico m inner join especialidad e using(esp_id) where e.esp_id=$1`,
              [especialidad.esp_id]
            );
            especialidad.medicos = medicos;
            for (const key in medicos) {
              if (Object.hasOwnProperty.call(medicos, key)) {
                const medico = medicos[key];
                const citas = await db.any(
                  `select * from cita_medica where med_id=$1`,
                  [medico.med_id]
                );
                medico.citas = citas;
                for (const key in citas) {
                  if (Object.hasOwnProperty.call(citas, key)) {
                    const cita = citas[key];
                    cita.paciente = await db.one(
                      `select p.* from paciente p inner join cita_medica c using(pac_id) where c.cit_med_id=$1`,
                      [cita.cit_med_id]
                    );
                  }
                }
              }
            }
          }
        }
        return especialidades;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  },
  Mutation: {
    async setPacientes(root, { paciente }) {
      try {
        return await db.one(
          `INSERT INTO paciente(pac_identificacion, pac_nombre, pac_telefono, pac_email, pac_direccion, pac_estado)
          VALUES($1, $2, $3, $4, $5, true) returning *;`,
          [
            paciente.pac_identificacion,
            paciente.pac_nombre,
            paciente.pac_telefono,
            paciente.pac_email,
            paciente.pac_direccion,
          ]
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async setMedicos(root, { medico }) {
      try {
        const subsql = await db.one(
          `SELECT esp_id FROM especialidad WHERE esp_nombre=$1`,
          [medico.esp_nombre]
        );
        medico.esp_id = subsql.esp_id;
        return await db.one(
          `INSERT INTO medico(esp_id, med_identificacion, med_nombre, med_telefono, med_email, med_direccion, med_estado)
          VALUES($1, $2, $3, $4, $5, $6, true) returning *;`,
          [
            medico.esp_id,
            medico.med_identificacion,
            medico.med_nombre,
            medico.med_telefono,
            medico.med_email,
            medico.med_direccion,
          ]
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    async setCitas(root, { cita }) {
      try {
        return await db.one(
          `INSERT INTO cita_medica(pac_id, med_id, cit_med_fecha, cit_med_agendado, cit_med_estado)
          VALUES($1, $2, $3, true, true) returning *;`,
          [cita.pac_id, cita.med_id, cita.cit_med_fecha]
        );
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  },
};
