var CronJob = require('cron').CronJob;
var User = require('../models/user');
var Tenant = require('../models/tenant');
var _ = require('lodash');
const config = require('../../config/index');
var mailService = require('../services/mail');
var initCronJobs = function () {
    /* init cache cron */

    var cacheJob = new CronJob({
        cronTime: '0 0 23 * * *',
        onTick: function () {


            var cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - config.diasExpiracion);

            User.find({ active: true, role: 'user' }).
                populate({ path: 'tenants', match: { $and: [{ activatedAt: { $lt: cutoff }, status: { $ne: 'EXPIRADO' } }] } }).
                exec(
                function (err, users) {
                    var mongoose = require('mongoose');
                    var userids = _.map(users, '_id');
                    var arrayTenants = [];

                    var tenants = [];

                    users.forEach(function (element) {


                        var a = _.map(element.tenants, '_id');
                        tenants = tenants.concat(element.tenants);

                        if (a instanceof Array)
                            arrayTenants = arrayTenants.concat(a);
                        else
                            arrayTenants.push(a);


                    }, this);

                    var tenantUpdate = {};


                    tenantUpdate.status = 'EXPIRADO';
                    tenantUpdate.expiredAt = new Date();
                    tenantUpdate.updatedAt = new Date();
                    tenantUpdate.updatedBy = 'CRON_JOB';

                    var userUpdate = {};

                    userUpdate.active = false;
                    userUpdate.updatedAt = new Date();
                    userUpdate.updatedBy = 'CRON_JOB';


                    Tenant.update({ _id: { $in: arrayTenants } },
                        { $set: tenantUpdate },
                        { upsert: false, minimize: false, multi: true }).exec((err, Dialog) => {
                            if (err) {
                                console.error(err)
                            }
                        });

                    User.update({ _id: { $in: userids } },
                        { $set: userUpdate },
                        { upsert: false, minimize: false, multi: true }).exec((err, Dialog) => {
                            if (err) {
                                console.error(err)
                            }
                        });

                    tenants.forEach(async function (element) {


                        var emailOptions = {
                            //TODO: cambiar el to y el subject
                            to: element.email,
                            subject: 'La prueba freemium (30 días) llegó a su fin',
                            text: 'texto',
                            firstname: element.fullName
                        }

                        let respuesta = await mailService.enviarMailExpiracion(emailOptions);
                        console.log(respuesta)
                    }, this);



                }
                );
        },
        start: false
    });
    cacheJob.start();
    console.log('CACHE CRON Job started and set to trigger every day at 23:00');
};

module.exports = { initCronJobs }

