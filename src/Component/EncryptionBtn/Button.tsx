import style from './btn.module.css'
type Props = {
  isLoading: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>
export const EncryptionBtn = ({isLoading,...rest}:Props)=>{
  return   <button className={style.button} {...rest}>{isLoading ? 'Encrypting...' : 'Encrypt File'}</button>
}
