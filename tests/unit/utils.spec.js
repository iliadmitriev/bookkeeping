import {minPassLen} from "@/utils/constants";

import {
  providerAuth,
  getProviderForProviderId,
} from "@/utils/firebase";
import {addMonths, baseLog, numberOfPaymentsLeft, paymentAnnuity, random_rgba, validateEmail} from "@/utils/helpers";

const googleAddScope = jest.fn()
const fbAddScope = jest.fn()
const setCustomParameters = jest.fn()
const githubAddScope = jest.fn()

providerAuth.GoogleAuthProvider = jest.fn(() => ({
  addScope: googleAddScope
}))
providerAuth.FacebookAuthProvider = jest.fn(() => ({
  addScope: fbAddScope,
  setCustomParameters: setCustomParameters
}))
providerAuth.GithubAuthProvider = jest.fn(() => ({
  addScope: githubAddScope
}))

describe('Utils testsuite', () => {

  it('Constants import', () => {
    expect(minPassLen).toBe(6);
  })

  describe('Firebase utils', () => {

    beforeEach(() => {
      providerAuth.GoogleAuthProvider.mockClear()
      providerAuth.FacebookAuthProvider.mockClear()
      providerAuth.GithubAuthProvider.mockClear()
    })

    it('getProviderForProviderId google.com', () => {
      getProviderForProviderId('google.com')
      expect(providerAuth.GoogleAuthProvider).toHaveBeenCalledTimes(1)
      expect(providerAuth.FacebookAuthProvider).toHaveBeenCalledTimes(0)
      expect(providerAuth.GithubAuthProvider).toHaveBeenCalledTimes(0)
      expect(googleAddScope).toHaveBeenCalledTimes(3)
      expect(googleAddScope).toHaveBeenCalledWith("openid")
      expect(googleAddScope).toHaveBeenCalledWith("profile")
      expect(googleAddScope).toHaveBeenCalledWith("email")
      expect(googleAddScope).not.toHaveBeenCalledWith("user:email")
    })

    it('getProviderForProviderId facebook.com', () => {
      getProviderForProviderId('facebook.com')
      expect(providerAuth.FacebookAuthProvider).toHaveBeenCalledTimes(1)
      expect(providerAuth.GoogleAuthProvider).toHaveBeenCalledTimes(0)
      expect(providerAuth.GithubAuthProvider).toHaveBeenCalledTimes(0)
      expect(fbAddScope).toHaveBeenCalledTimes(1)
      expect(fbAddScope).toHaveBeenCalledWith("email")
      expect(setCustomParameters).toHaveBeenCalledTimes(1)
      expect(setCustomParameters).toHaveBeenCalledWith({
        'display': 'popup'
      })
    })

    it('getProviderForProviderId github.com', () => {
      getProviderForProviderId('github.com')
      expect(providerAuth.GithubAuthProvider).toHaveBeenCalledTimes(1)
      expect(providerAuth.FacebookAuthProvider).toHaveBeenCalledTimes(0)
      expect(providerAuth.GoogleAuthProvider).toHaveBeenCalledTimes(0)
      expect(githubAddScope).toHaveBeenCalledTimes(2)
      expect(githubAddScope).toHaveBeenCalledWith("user:email")
      expect(githubAddScope).toHaveBeenCalledWith("read:user")
    })

    it('getProviderForProviderId unknown', () => {
      expect(getProviderForProviderId('unknown')).toBeFalsy()
      expect(providerAuth.GithubAuthProvider).toHaveBeenCalledTimes(0)
      expect(providerAuth.FacebookAuthProvider).toHaveBeenCalledTimes(0)
      expect(providerAuth.GoogleAuthProvider).toHaveBeenCalledTimes(0)
    })

  })

  describe('Helpers', () => {

    beforeEach(() => {
    })

    it.each([
      {email: 'idm.test@mail.ru', expected: true},
      {email: 'idm123123.test@mail.domain.com', expected: true},
      {email: 'z.check.test@mail.ru', expected: true},
      {email: '123123.test@google.com', expected: true},
      {email: 'idm.test@mail.ru', expected: true},
      {email: '[]test@mail.ru', expected: false},
      {email: '<test@mail.ru', expected: false},
      {email: '.test@mail.ru', expected: false},
      {email: '(test@mail.r', expected: false},
      {email: '@test@mail.r', expected: false},
    ])
    ('validateEmail $email',
      ({email, expected}) => {
        expect(validateEmail(email)).toBe(expected)
      })


    it('addMonths', () => {
      expect(addMonths(new Date("1999-04-03"), 5).toISOString().split('T')[0])
        .toStrictEqual(new Date('1999-09-03').toISOString().split('T')[0])

      expect(addMonths(new Date("2001-09-01"), 5).toISOString().split('T')[0])
        .toStrictEqual(new Date('2002-02-01').toISOString().split('T')[0])

      expect(addMonths(new Date("2001-09-01"), 240).toISOString().split('T')[0])
        .toStrictEqual(new Date('2021-09-01').toISOString().split('T')[0])

      expect(addMonths(new Date("1999-01-28"), 1).toISOString().split('T')[0])
        .toStrictEqual(new Date('1999-02-28').toISOString().split('T')[0])

      // fix february 31th :-)
      expect(addMonths(new Date("1999-01-31"), 1).toISOString().split('T')[0])
        .toStrictEqual(new Date('1999-02-28').toISOString().split('T')[0])
      // fix leap year february 31th
      expect(addMonths(new Date("2004-01-31"), 1).toISOString().split('T')[0])
        .toStrictEqual(new Date('2004-02-29').toISOString().split('T')[0])
    })

    it('Logarithm function baseLog', () => {
      expect(baseLog(6, 216)).toBeCloseTo(3, 10)
      expect(baseLog(3, 81)).toBeCloseTo(4, 10)
      expect(baseLog(2, 32)).toBeCloseTo(5, 10)
      expect(baseLog(5, -10)).toBeNaN()
    })

    it('annuity function numberOfPaymentsLeft', () => {
      expect(numberOfPaymentsLeft(10000, 0.012, 500000)).toBe(77)
      expect(numberOfPaymentsLeft(10000, -0.012, 500000)).toBe(39)
      expect(numberOfPaymentsLeft(10000, 0.00000001, 500000)).toBe(51)
      expect(numberOfPaymentsLeft(1000000, 1, 500000)).toBe(1)
      expect(numberOfPaymentsLeft(6001, 0.012, 500000)).toBe(730)
      expect(numberOfPaymentsLeft(6000, 0.012, 500000)).toBe(Number.POSITIVE_INFINITY)
      expect(numberOfPaymentsLeft(5000, 0.012, 500000)).toBeNaN()
    })

    it('annuity function paymentAnnuity', () => {
      expect(paymentAnnuity(77, 0.012, 500000))
        .toBeCloseTo(9985.309, 2)
      expect(paymentAnnuity(39, -0.012, 500000))
        .toBeCloseTo(9977.985, 2)
      expect(paymentAnnuity(1, 0.00000001, 500000))
        .toBeCloseTo(500000.008, 2)
      expect(paymentAnnuity(51, 0.00000001, 500000))
        .toBeCloseTo(9803.924, 2)
      expect(paymentAnnuity(1000, 0.012, 500000))
        .toBeCloseTo(6000.039, 2)
      expect(paymentAnnuity(100, 0, 50000)).toBeNaN()
    })

    it('random_rgba color array generator', () => {

      const res = random_rgba(20)
      expect(res.backgroundColors).toBeTruthy()
      expect(res.backgroundColors).toBeTruthy()
      expect(res.backgroundColors.length).toBe(20)
      expect(res.borderColors.length).toBe(20)
      expect(res.backgroundColors).toEqual(
        expect.arrayContaining([
            expect.stringMatching(/^rgba\(\d+,\d+,\d+, 0.2\)$/)
          ]
        ),
      );
      expect(res.borderColors).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/^rgba\(\d+,\d+,\d+, 1\)$/)
        ])
      )

      const res2 = random_rgba(20, 0.3)
      expect(res2.backgroundColors).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/^rgba\(\d+,\d+,\d+, 0.3\)$/)
        ])
      )

    })
  })

})
