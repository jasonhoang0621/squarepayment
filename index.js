const express = require('express');
const { json, send } = require('micro');
const retry = require('async-retry');
const { ApiError, client: square } = require('./utils/square');
const path = require('path');
const { randomUUID } = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/payment', async function (req, res) {
    const payload = await json(req);
    await retry(async (bail, attempt) => {
        try {
            console.log('Creating payment', { attempt });

            const idempotencyKey = payload.idempotencyKey || randomUUID();
            const payment = {
                idempotencyKey,
                locationId: payload.locationId,
                sourceId: payload.sourceId,
                amountMoney: {
                    amount: payload.amount,
                    currency: 'USD',
                },
            };

            const { result, statusCode } = await square.paymentsApi.createPayment(
                payment
            );

            console.log('Payment succeeded!', { result, statusCode });

            send(res, statusCode, {
                success: true,
                payment: {
                    id: result.payment.id,
                    status: result.payment.status,
                    receiptUrl: result.payment.receiptUrl,
                    orderId: result.payment.orderId,
                },
            });
        } catch (ex) {
            if (ex instanceof ApiError) {
                console.error(ex.errors);
                bail(ex);
            } else {
                console.error(`Error creating payment on attempt ${attempt}: ${ex}`);
                throw ex;
            }
        }
    });
})


app.listen(PORT, () => {
    console.log(`app listen at port ${PORT}`)
})