import Vue from 'vue';
import formatTime from '~/formatTime.js';
import { createVue, destroyVM } from '../utils';

Vue.use(formatTime);

describe('formatTime', function () {
    let vm = createVue({
        template: `
            <p>{{ testDate | formatTime('YYYY-MM-DD') }}</p>
        `,
        data() {
            return {
                testDate: 1490774006864
            };
        }
    }, true);

    it('Vue.formatTime', () => {
        // 2017年3月29日15点53分26秒
        let date = vm.$data.testDate;
        let dayFormat = Vue.formatTime(date, 'YYYY-MM-DD');
        let secondFormat = Vue.formatTime(date, 'YYYY-MM-DD hh:mm:ss:S');
        expect(dayFormat).to.be.equal('2017-03-29');
        expect(secondFormat).to.be.equal('2017-03-29 15:53:26:864');

        date = 123;
        expect(Vue.formatTime(date, 'YYYY-MM-DD')).to.be.equal('1970-01-01');

        date = 149077400686412312313;
        expect(Vue.formatTime(date, 'YYYY-MM-DD')).to.be.equal(149077400686412300000);

        date = '2017年3月29日';
        expect(Vue.formatTime(date, 'YYYY-MM-DD')).to.be.equal('2017年3月29日');

        date = '';
        expect(Vue.formatTime(date, 'YYYY-MM-DD')).to.be.equal('');

        date = null;
        expect(Vue.formatTime(date, 'YYYY-MM-DD')).to.be.equal('');

        date = void 0;
        expect(Vue.formatTime(date, 'YYYY-MM-DD')).to.be.equal('');
    });

    it('Vue.protoType.formatTime', () => {
        // 2017年3月29日15点53分26秒
        let date = vm.$data.testDate;
        let dayFormat = vm.$formatTime(date, 'YYYY-MM-DD');
        let secondFormat = vm.$formatTime(date, 'YYYY-MM-DD hh:mm:ss');
        expect(dayFormat).to.be.equal('2017-03-29');
        expect(secondFormat).to.be.equal('2017-03-29 15:53:26');
    });

    it('Vue.filter: formatTime', () => {
        expect(vm.$el.innerText).to.be.equal('2017-03-29');
    });

    afterEach(() => {
        destroyVM(vm);
    });
});
